/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License").
 *  You may not use this file except in compliance with the License.
 *  A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 *  or in the "license" file accompanying this file. This file is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *  express or implied. See the License for the specific language governing
 *  permissions and limitations under the License.
 */

/* eslint-disable import/prefer-default-export */
import { httpApiGet, httpApiPost, httpApiPut, httpApiDelete } from '@aws-ee/base-ui/dist/helpers/api';

function getUserRoles() {
  return httpApiGet('api/user-roles');
}

function getAwsAccounts() {
  return httpApiGet('api/aws-accounts');
}

function getAwsAccount(accountId) {
  return httpApiGet(`api/aws-accounts/${accountId}`);
}

function addUsers(users) {
  return httpApiPost('api/users/bulk', { data: users });
}

function addAwsAccount(awsAccount) {
  return httpApiPost('api/aws-accounts', { data: awsAccount });
}

function createAwsAccount(awsAccount) {
  return httpApiPost('api/aws-accounts/provision', { data: awsAccount });
}

function addIndex(index) {
  return httpApiPost('api/indexes', { data: index });
}

function updateUserApplication(user) {
  // const params = {};
  // if (user.authenticationProviderId) {
  //   params.authenticationProviderId = user.authenticationProviderId;
  // }
  // if (user.identityProviderName) {
  //   params.identityProviderName = user.identityProviderName;
  // }
  // return httpApiPut(`api/users/${user.username}/userself`, { data: user, params });
  return httpApiPut(`api/user`, { data: user });
}

async function deleteUser(user) {
  const data = {};
  if (user.authenticationProviderId) {
    data.authenticationProviderId = user.authenticationProviderId;
  }
  if (user.identityProviderName) {
    data.identityProviderName = user.identityProviderName;
  }
  return httpApiDelete(`api/users/${user.username}`, { data });
}

function getStudies(category) {
  return httpApiGet('api/studies', { params: { category } });
}

function getStudy(id) {
  return httpApiGet(`api/studies/${id}`);
}

function createStudy(body) {
  return httpApiPost('api/studies', { data: body });
}

function listStudyFiles(studyId) {
  return httpApiGet(`api/studies/${studyId}/files`);
}

function getPresignedStudyUploadRequests(studyId, filenames) {
  if (Array.isArray(filenames)) {
    filenames = filenames.join(',');
  }
  return httpApiGet(`api/studies/${studyId}/upload-requests`, { params: { filenames } });
}

function getStudyPermissions(studyId) {
  return httpApiGet(`api/studies/${studyId}/permissions`);
}

function updateStudyPermissions(studyId, updateRequest) {
  return httpApiPut(`api/studies/${studyId}/permissions`, { data: updateRequest });
}

async function getStepTemplates() {
  return httpApiGet('api/step-templates');
}

function getEnvironments() {
  return httpApiGet('api/workspaces');
}

function getEnvironmentCost(id, numberDaysInPast, groupByService = true, groupByUser = false) {
  return httpApiGet(
    `api/costs?env=${id}&numberOfDaysInPast=${numberDaysInPast}&groupByService=${groupByService}&groupByUser=${groupByUser}`,
  );
}

function getAllProjCostGroupByUser(numberDaysInPast) {
  return httpApiGet(`api/costs?proj=ALL&groupByUser=true&numberOfDaysInPast=${numberDaysInPast}`);
}

function getAllProjCostGroupByEnv(numberDaysInPast) {
  return httpApiGet(`api/costs?proj=ALL&groupByEnv=true&numberOfDaysInPast=${numberDaysInPast}`);
}

function getEnvironment(id) {
  return httpApiGet(`api/workspaces/${id}`);
}

function deleteEnvironment(id) {
  return httpApiDelete(`api/workspaces/${id}`);
}

function createEnvironment(body) {
  return httpApiPost('api/workspaces', { data: body });
}

function updateEnvironment(body) {
  return httpApiPut('api/workspaces', { data: body });
}

function getEnvironmentKeypair(id) {
  return httpApiGet(`api/workspaces/${id}/keypair`);
}

function getEnvironmentPasswordData(id) {
  return httpApiGet(`api/workspaces/${id}/password`);
}

function getEnvironmentNotebookUrl(id) {
  return httpApiGet(`api/workspaces/${id}/url`);
}

function getEnvironmentSpotPriceHistory(type) {
  return httpApiGet(`api/workspaces/pricing/${type}`);
}

function getExternalTemplate(key) {
  return httpApiGet(`api/template/${key}`);
}

function getIndexes() {
  return httpApiGet('api/indexes');
}

function getIndex(indexId) {
  return httpApiGet(`api/indexes/${indexId}`);
}

function getProjects() {
  return httpApiGet('api/projects');
}

function getProject(id) {
  return httpApiGet(`api/projects/${id}`);
}

function addProject(project) {
  return httpApiPost('api/projects', { data: project });
}

function getAccounts() {
  return httpApiGet('api/accounts');
}

function getAccount(id) {
  return httpApiGet(`api/accounts/${id}`);
}

function removeAccountInfo(id) {
  return httpApiDelete(`api/accounts/${id}`);
}

function getComputePlatforms() {
  return httpApiGet(`api/compute/platforms`);
}

function getComputeConfigurations(platformId) {
  return httpApiGet(`api/compute/platforms/${platformId}/configurations`);
}

function getClientIpAddress() {
  return httpApiGet(`api/ip`);
}

// API Functions Insertion Point (do not change this text, it is being used by hygen cli)

export {
  addIndex,
  addUsers,
  removeAccountInfo,
  deleteUser,
  getUserRoles,
  getAwsAccounts,
  getAwsAccount,
  getStudies,
  getStudy,
  createStudy,
  listStudyFiles,
  getPresignedStudyUploadRequests,
  getStudyPermissions,
  updateStudyPermissions,
  addAwsAccount,
  createAwsAccount,
  getStepTemplates,
  getEnvironments,
  getEnvironment,
  getEnvironmentCost,
  deleteEnvironment,
  createEnvironment,
  updateEnvironment,
  getEnvironmentKeypair,
  getEnvironmentPasswordData,
  getEnvironmentNotebookUrl,
  getEnvironmentSpotPriceHistory,
  getExternalTemplate,
  getAllProjCostGroupByUser,
  getIndexes,
  getIndex,
  getAllProjCostGroupByEnv,
  updateUserApplication,
  getProjects,
  getProject,
  addProject,
  getAccounts,
  getAccount,
  getComputePlatforms,
  getComputeConfigurations,
  getClientIpAddress,
};