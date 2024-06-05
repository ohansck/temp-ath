import { Injectable, Logger } from '@nestjs/common';
import { IAMClient, GetUserCommand, GetUserCommandInput, GetUserCommandOutput, ListAttachedRolePoliciesCommand, ListAttachedUserPoliciesCommand, GetPolicyCommand, GetPolicyVersionCommand, Policy } from '@aws-sdk/client-iam';
import axios from 'axios';

@Injectable()
export class IamService {
    private iamClient: IAMClient;
    private readonly logger = new Logger(IamService.name);
    constructor() {
        this.iamClient = new IAMClient();
    }

    private async getPolicyDocument(policyArn: string): Promise<any> {
        const policy = await this.iamClient.send(new GetPolicyCommand({ PolicyArn: policyArn }));

        // const policyVersion = await this.iamClient.send(new GetPolicyVersionCommand({
        //     PolicyArn: policyArn,
        //     VersionId: policy.Policy.DefaultVersionId,
        // }));
        console.log(policy);
        return policy.Policy;
    }

    async getUserPolicyStatements(userName: string): Promise<any[]> {
        try {
            const attachedPolicies = await this.iamClient.send(new ListAttachedUserPoliciesCommand({ UserName: userName }));

            const policyStatements: Policy[] = await Promise.all(
                attachedPolicies.AttachedPolicies.map(policy => this.getPolicyDocument(policy.PolicyArn))
            );

            policyStatements.forEach(policy => {
                if (policy.PolicyName === 'AdministratorAccess') {
                    this.logger.log('Found AdministratorAccess policy');
                    return { error: 'Administrator Access Policy Found' };
                }
            });

            return policyStatements;
        } catch (error) {
            console.error('Error getting user policy statements:', error);
            throw error;
        }
    }

    async getRolePolicyStatements(roleName: string): Promise<any[]> {
        try {
            const attachedPolicies = await this.iamClient.send(new ListAttachedRolePoliciesCommand({ RoleName: roleName }));
            const policyStatements = await Promise.all(
                attachedPolicies.AttachedPolicies.map(policy => this.getPolicyDocument(policy.PolicyArn))
            );
            return policyStatements;
        } catch (error) {
            console.error('Error getting role policy statements:', error);
            throw error;
        }
    }

    async getRoleNameFromInstanceMetadata(): Promise<string> {
        try {
            const response = await axios.get('http://169.254.169.254/latest/meta-data/iam/security-credentials/');
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching IAM role from instance metadata:', error);
            throw error;
        }
    }

    async getAttachedPolicies(): Promise<any[]> {
        const roleName = await this.getRoleNameFromInstanceMetadata();
        return this.getRolePolicyStatements(roleName);
    }

    async getUserDetails(userName: string): Promise<GetUserCommandOutput> {
        const params: GetUserCommandInput = {
            UserName: userName,
        };

        const command = new GetUserCommand(params);
        try {
            const data = await this.iamClient.send(command);
            return data;
        } catch (error) {
            throw new Error(`Error fetching user details: ${error.message}`);
        }
    }
}
