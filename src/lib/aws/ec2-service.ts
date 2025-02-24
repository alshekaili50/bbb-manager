import {
  RunInstancesCommand,
  StopInstancesCommand,
  StartInstancesCommand,
  TerminateInstancesCommand,
  DescribeInstancesCommand,
  type Instance as EC2Instance,
  type _InstanceType,
} from '@aws-sdk/client-ec2'
import { ec2Client } from './ec2-client'
import { type Instance } from '@/types'

export class EC2Service {
  private static instance: EC2Service
  private constructor() {}

  public static getInstance(): EC2Service {
    if (!EC2Service.instance) {
      EC2Service.instance = new EC2Service()
    }
    return EC2Service.instance
  }

  async createInstance(params: {
    name: string
    type: string
    region: string
    organizationId: string
  }): Promise<Instance> {
    const { name, type, region, organizationId } = params

    const command = new RunInstancesCommand({
      ImageId: 'ami-0c7217cdde317cfec', // Ubuntu 22.04 LTS
      InstanceType: type as _InstanceType,
      MinCount: 1,
      MaxCount: 1,
      TagSpecifications: [
        {
          ResourceType: 'instance',
          Tags: [
            { Key: 'Name', Value: name },
            { Key: 'OrganizationId', Value: organizationId },
            { Key: 'Type', Value: 'BBB' },
          ],
        },
      ],
    })

    try {
      const response = await ec2Client.send(command)
      const ec2Instance = response.Instances?.[0]

      if (!ec2Instance?.InstanceId) {
        throw new Error('Failed to create instance')
      }

      return {
        id: crypto.randomUUID(),
        ec2InstanceId: ec2Instance.InstanceId,
        name,
        organizationId,
        status: 'running',
        region,
        type,
        lastActive: new Date(),
        costPerHour: this.getInstanceCostPerHour(type),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    } catch (error) {
      console.error('Error creating EC2 instance:', error)
      throw new Error('Failed to create instance')
    }
  }

  async stopInstance(instanceId: string): Promise<void> {
    const command = new StopInstancesCommand({
      InstanceIds: [instanceId],
    })

    try {
      await ec2Client.send(command)
    } catch (error) {
      console.error('Error stopping EC2 instance:', error)
      throw new Error('Failed to stop instance')
    }
  }

  async startInstance(instanceId: string): Promise<void> {
    const command = new StartInstancesCommand({
      InstanceIds: [instanceId],
    })

    try {
      await ec2Client.send(command)
    } catch (error) {
      console.error('Error starting EC2 instance:', error)
      throw new Error('Failed to start instance')
    }
  }

  async terminateInstance(instanceId: string): Promise<void> {
    const command = new TerminateInstancesCommand({
      InstanceIds: [instanceId],
    })

    try {
      await ec2Client.send(command)
    } catch (error) {
      console.error('Error terminating EC2 instance:', error)
      throw new Error('Failed to terminate instance')
    }
  }

  async getInstanceStatus(instanceId: string): Promise<EC2Instance | null> {
    const command = new DescribeInstancesCommand({
      InstanceIds: [instanceId],
    })

    try {
      const response = await ec2Client.send(command)
      return response.Reservations?.[0]?.Instances?.[0] || null
    } catch (error) {
      console.error('Error getting EC2 instance status:', error)
      return null
    }
  }

  private getInstanceCostPerHour(type: string): number {
    // Simplified cost calculation - in reality, you'd want to use AWS Price List API
    const costs: Record<string, number> = {
      't2.micro': 0.0116,
      't2.small': 0.023,
      't2.medium': 0.0464,
    }
    return costs[type] || 0
  }
} 