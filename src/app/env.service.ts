export class EnvService {

  // The values that are defined here are the default values that can
  // be overridden by env.js

  // API url

  // Whether or not to enable debug mode
  public enableDebug = 0;
  public production = false;
  public version = '';
  public baseApiUrl = '';
  public hubUrl = '';
  public reportApiUrl = '';
  public identityApi = '';

  constructor() {
  }

}
