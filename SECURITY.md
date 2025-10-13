# Security Guidelines

## 🔒 Repository Security Measures

### Environment Variables
- ✅ All sensitive data in `.env.local` (not committed)
- ✅ OIDC authentication for AWS services
- ✅ No hardcoded credentials in source code

### AWS Security
- **Authentication**: OIDC integration
- **Permissions**: Minimal IAM permissions for DynamoDB
- **Region**: EU-West-1 for GDPR compliance
- **Encryption**: DynamoDB encryption at rest

### API Security
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Zod schema validation
- **Error Handling**: No sensitive data in error responses
- **CORS**: Restricted to allowed origins

### Data Protection
- **PII Handling**: Generic placeholders in examples
- **User Data**: Minimal collection (email, username)
- **Logging**: No sensitive data in logs
- **Sanitization**: Input sanitization for XSS prevention

## 🚨 Security Checklist

### Before Deployment
- [ ] Remove all `.env*` files from git history
- [ ] Rotate any exposed AWS credentials
- [ ] Verify no hardcoded secrets in code
- [ ] Update production environment variables
- [ ] Enable GitHub security features

### GitHub Repository Settings
- [ ] Enable branch protection rules
- [ ] Require PR reviews for main branch
- [ ] Enable security alerts
- [ ] Configure secret scanning
- [ ] Set up dependency vulnerability alerts

### Production Security
- [ ] Use HTTPS only
- [ ] Configure CSP headers
- [ ] Enable security headers
- [ ] Set up monitoring and alerting
- [ ] Regular security audits

## 🔧 Security Commands

### Clean Git History
```bash
# Remove sensitive files from git history
./security-cleanup.sh
```

### Audit Dependencies
```bash
npm audit
npm audit fix
```

### Environment Setup
```bash
# Copy example and fill with real values
cp .env.local.example .env.local
# Never commit .env.local
```

## 📞 Security Contacts

- **Security Issues**: Create private security advisory on GitHub
- **Vulnerabilities**: Report via GitHub Security tab
- **General Security**: security@trickshare.com

## 🔄 Regular Security Tasks

### Weekly
- Review dependency vulnerabilities
- Check for exposed secrets
- Monitor access logs

### Monthly
- Rotate API keys
- Review user permissions
- Update security documentation

### Quarterly
- Security audit
- Penetration testing
- Update security policies
