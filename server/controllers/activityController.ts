import { Request, Response } from 'express';
import axios from 'axios';
import path from 'path';

const ACTIVITY_BACKEND_URL = process.env.ACTIVITY_BACKEND_URL || 'http://localhost:5000';

// Helper function to proxy requests
async function proxyRequest(req: Request, res: Response, path: string, method: 'GET' | 'POST' | 'PUT' = 'GET') {
  try {
    const url = `${ACTIVITY_BACKEND_URL}/api/activity${path}`;
    console.log(`Proxying ${method} ${url}`);

    let response;
    switch (method) {
      case 'POST':
        response = await axios.post(url, req.body);
        break;
      case 'PUT':
        response = await axios.put(url, req.body);
        break;
      default:
        response = await axios.get(url);
    }

    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error(`Error proxying to activity backend:`, error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Failed to connect to activity backend' });
    }
  }
}

// Configuration endpoints
export async function getConfigParams(req: Request, res: Response) {
  await proxyRequest(req, res, '/config/params', 'GET');
}

export async function updateConfigParams(req: Request, res: Response) {
  await proxyRequest(req, res, '/config/params', 'PUT');
}

export async function createConfig(req: Request, res: Response) {
  // Serve the HTML form for creating a new activity
  const htmlPath = path.join(__dirname, '../views/createActivity.html');
  res.sendFile(htmlPath);
}

export async function getConfig(req: Request, res: Response) {
  const { activityId } = req.params;
  await proxyRequest(req, res, `/config/${activityId}`, 'GET');
}

export async function getAllConfigs(req: Request, res: Response) {
  await proxyRequest(req, res, '/config', 'GET');
}

// Deployment instance endpoints
export async function deployActivity(req: Request, res: Response) {
  await proxyRequest(req, res, '/deploy', 'POST');
}

export async function getInstance(req: Request, res: Response) {
  const { instanceId } = req.params;
  await proxyRequest(req, res, `/deploy/${instanceId}`, 'GET');
}

export async function getInstancesByActivity(req: Request, res: Response) {
  const { activityId } = req.params;
  await proxyRequest(req, res, `/deploy/activity/${activityId}`, 'GET');
}

// Submission endpoints
export async function recordSubmission(req: Request, res: Response) {
  await proxyRequest(req, res, '/submissions', 'POST');
}

export async function getSubmissionsByInstance(req: Request, res: Response) {
  const { instanceId } = req.params;
  await proxyRequest(req, res, `/submissions/instance/${instanceId}`, 'GET');
}

export async function getSubmissionByInstanceAndStudent(req: Request, res: Response) {
  const { instanceId, studentId } = req.params;
  await proxyRequest(req, res, `/submissions/instance/${instanceId}/student/${studentId}`, 'GET');
}
