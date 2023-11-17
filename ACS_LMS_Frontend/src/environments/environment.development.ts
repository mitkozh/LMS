export const environment = {
    production: false,
    authorize_uri: 'http://localhost:9000/oauth2/authorize?',
    client_id : 'client',
    redirect_uri: 'http://localhost:4200/authorized',
    scope: 'openid',
    response_type: 'code',
    response_mode: 'form_post',
    code_challenge_method: 'S256',
    code_challenge: 'meWMSrkRBnMbd5RRseIVwuFGFOU6xwHi0_LgQyCOd1A',
    code_verifier: 'vaJQvOcb8RfWoZWFvpSLAQjUywZx2VUiG6cAZpr7MV7',
    token_url: 'http://localhost:9000/oauth2/token',
    grant_type: 'authorization_code',
    resource_url: 'http://localhost:8080/resource/',
    logout_url: 'http://localhost:9000/logout',
    secret_pkce: 'secret'
  
  };