const cdk = require('aws-cdk-lib');
const codepipeline = require('aws-cdk-lib/aws-codepipeline');
const codepipelineActions = require('aws-cdk-lib/aws-codepipeline-actions');
const codebuild = require('aws-cdk-lib/aws-codebuild');
const s3 = require('aws-cdk-lib/aws-s3');
const iam = require('aws-cdk-lib/aws-iam');

class TrickSharePipelineStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // S3 bucket for pipeline artifacts
    const artifactsBucket = new s3.Bucket(this, 'PipelineArtifacts', {
      bucketName: `trickshare-pipeline-${this.account}-${this.region}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    // CodeBuild project for building and deploying
    const buildProject = new codebuild.Project(this, 'BuildProject', {
      projectName: 'TrickShare-Build',
      source: codebuild.Source.gitHub({
        owner: 'YOUR_GITHUB_USERNAME', // Replace with your GitHub username
        repo: 'tricky', // Replace with your repo name
        webhook: true,
        webhookFilters: [
          codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs('main')
        ]
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        computeType: codebuild.ComputeType.SMALL
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            'runtime-versions': {
              nodejs: '18'
            },
            commands: [
              'npm install -g aws-cdk',
              'npm install'
            ]
          },
          build: {
            commands: [
              'npm run build',
              'npx cdk deploy --require-approval never'
            ]
          }
        },
        artifacts: {
          files: [
            'out/**/*'
          ]
        }
      })
    });

    // Grant permissions to CodeBuild
    buildProject.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'cloudformation:*',
        's3:*',
        'cloudfront:*',
        'dynamodb:*',
        'iam:*',
        'lambda:*'
      ],
      resources: ['*']
    }));

    // Pipeline artifacts
    const sourceOutput = new codepipeline.Artifact('SourceOutput');
    const buildOutput = new codepipeline.Artifact('BuildOutput');

    // CodePipeline
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: 'TrickShare-Pipeline',
      artifactBucket: artifactsBucket,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipelineActions.GitHubSourceAction({
              actionName: 'GitHub_Source',
              owner: 'YOUR_GITHUB_USERNAME', // Replace with your GitHub username
              repo: 'tricky', // Replace with your repo name
              branch: 'main',
              oauthToken: cdk.SecretValue.secretsManager('github-token'), // Create this secret
              output: sourceOutput
            })
          ]
        },
        {
          stageName: 'Build',
          actions: [
            new codepipelineActions.CodeBuildAction({
              actionName: 'Build_and_Deploy',
              project: buildProject,
              input: sourceOutput,
              outputs: [buildOutput]
            })
          ]
        }
      ]
    });

    // Outputs
    new cdk.CfnOutput(this, 'PipelineName', {
      value: pipeline.pipelineName,
      description: 'CodePipeline Name'
    });

    new cdk.CfnOutput(this, 'BuildProjectName', {
      value: buildProject.projectName,
      description: 'CodeBuild Project Name'
    });
  }
}

module.exports = { TrickSharePipelineStack };
