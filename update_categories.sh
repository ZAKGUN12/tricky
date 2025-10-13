#!/bin/bash

# Update all missing cooking categories
aws dynamodb update-item --table-name TrickShare-Tricks --key '{"id":{"S":"cn-tea-003"}}' --update-expression "SET category = :cat" --expression-attribute-values '{":cat":{"S":"cooking"}}' --region eu-west-1
aws dynamodb update-item --table-name TrickShare-Tricks --key '{"id":{"S":"in-curry-001"}}' --update-expression "SET category = :cat" --expression-attribute-values '{":cat":{"S":"cooking"}}' --region eu-west-1
aws dynamodb update-item --table-name TrickShare-Tricks --key '{"id":{"S":"cn-dumpling-001"}}' --update-expression "SET category = :cat" --expression-attribute-values '{":cat":{"S":"cooking"}}' --region eu-west-1
aws dynamodb update-item --table-name TrickShare-Tricks --key '{"id":{"S":"tr-tea-001"}}' --update-expression "SET category = :cat" --expression-attribute-values '{":cat":{"S":"cooking"}}' --region eu-west-1
aws dynamodb update-item --table-name TrickShare-Tricks --key '{"id":{"S":"br-coffee-001"}}' --update-expression "SET category = :cat" --expression-attribute-values '{":cat":{"S":"cooking"}}' --region eu-west-1
aws dynamodb update-item --table-name TrickShare-Tricks --key '{"id":{"S":"tr-baklava-002"}}' --update-expression "SET category = :cat" --expression-attribute-values '{":cat":{"S":"cooking"}}' --region eu-west-1
aws dynamodb update-item --table-name TrickShare-Tricks --key '{"id":{"S":"jp-ramen-002"}}' --update-expression "SET category = :cat" --expression-attribute-values '{":cat":{"S":"cooking"}}' --region eu-west-1
aws dynamodb update-item --table-name TrickShare-Tricks --key '{"id":{"S":"trick-austria-melange"}}' --update-expression "SET category = :cat" --expression-attribute-values '{":cat":{"S":"cooking"}}' --region eu-west-1
aws dynamodb update-item --table-name TrickShare-Tricks --key '{"id":{"S":"mx-tacos-001"}}' --update-expression "SET category = :cat" --expression-attribute-values '{":cat":{"S":"cooking"}}' --region eu-west-1
aws dynamodb update-item --table-name TrickShare-Tricks --key '{"id":{"S":"jp-sushi-001"}}' --update-expression "SET category = :cat" --expression-attribute-values '{":cat":{"S":"cooking"}}' --region eu-west-1
aws dynamodb update-item --table-name TrickShare-Tricks --key '{"id":{"S":"in-naan-002"}}' --update-expression "SET category = :cat" --expression-attribute-values '{":cat":{"S":"cooking"}}' --region eu-west-1
aws dynamodb update-item --table-name TrickShare-Tricks --key '{"id":{"S":"de-beer-001"}}' --update-expression "SET category = :cat" --expression-attribute-values '{":cat":{"S":"cooking"}}' --region eu-west-1
aws dynamodb update-item --table-name TrickShare-Tricks --key '{"id":{"S":"jp-tempura-003"}}' --update-expression "SET category = :cat" --expression-attribute-values '{":cat":{"S":"cooking"}}' --region eu-west-1
aws dynamodb update-item --table-name TrickShare-Tricks --key '{"id":{"S":"fr-wine-003"}}' --update-expression "SET category = :cat" --expression-attribute-values '{":cat":{"S":"cooking"}}' --region eu-west-1
aws dynamodb update-item --table-name TrickShare-Tricks --key '{"id":{"S":"it-pasta-001"}}' --update-expression "SET category = :cat" --expression-attribute-values '{":cat":{"S":"cooking"}}' --region eu-west-1
aws dynamodb update-item --table-name TrickShare-Tricks --key '{"id":{"S":"mx-guacamole-002"}}' --update-expression "SET category = :cat" --expression-attribute-values '{":cat":{"S":"cooking"}}' --region eu-west-1
aws dynamodb update-item --table-name TrickShare-Tricks --key '{"id":{"S":"br-caipirinha-002"}}' --update-expression "SET category = :cat" --expression-attribute-values '{":cat":{"S":"cooking"}}' --region eu-west-1
aws dynamodb update-item --table-name TrickShare-Tricks --key '{"id":{"S":"es-paella-001"}}' --update-expression "SET category = :cat" --expression-attribute-values '{":cat":{"S":"cooking"}}' --region eu-west-1

echo "All categories updated!"
