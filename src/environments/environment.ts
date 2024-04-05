// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  version: '03212022.01',
   baseApiUrl: 'https://localhost:44312/api',
   //baseUrl : 'https://qa.piauditpros.com',
  //baseApiUrl: 'https://devapi.telemedcube.com/api',
  //baseApiUrl: "https://qaapi.telemedcube.com/api",
  hubUrl: 'https://localhost:44310',
  reportApiUrl: 'https://localhost:44383',
  //reportApiUrl: 'https://devreportapi.telemedcube.com/'
};
