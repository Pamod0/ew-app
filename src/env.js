(function (window) {
  window.__env = window.__env || {};

  window.__env.enableDebug = true;
  window.__env.version = "05142022.01";

  // local url

  // window.__env.baseApiUrl = "https://localhost:44398/api";
  // window.__env.identityApi = "https://localhost:44398";
  // window.__env.reportApiUrl = "https://localhost:44398";
  // window.__env.hubUrl = "https://localhost:44310/TaskStatusMessageHub";

  // window.__env.baseApiUrl = "https://qaapi.accredify.com/api"; 
  // window.__env.identityApi = "https://qaidentity.piauditpros.com";
  // window.__env.reportApiUrl = "https://picvsreport.telemedcube.com";
  // window.__env.hubUrl = "https://localhost:44310/TaskStatusMessageHub";

  // dev api url
  //window.__env.baseApiUrl = "https://picvsapi.telemedcube.com/api";
  //window.__env.identityApi = "https://picvsidentity.telemedcube.com";
  //window.__env.reportApiUrl = "https://devapi.telemedcube.com/reports";
  //window.__env.hubUrl = "https://localhost:44310/TaskStatusMessageHub";

 // Production api url
  window.__env.baseApiUrl = "https://api.accredify.lk/api";
  window.__env.identityApi = "https://api.accredify.lk";
  window.__env.reportApiUrl = "https://api.accredify.lk";
  window.__env.hubUrl = "https://localhost:44310/TaskStatusMessageHub";
})(this);
