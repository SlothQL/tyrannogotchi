# Tyrannogotchi

CodeClan JavaScript Group Project

### How to run the application

#### Backend
* Create a free [Okta Developer account] (https://developer.okta.com/)
* Log in to your Okta account and navigate to Applications > Add Application
* Click Web and then Next
* Name your app and specify http://localhost:8080/login/oauth2/code/okta as a Login redirect URI
* Click Done, then click Edit to edit General Settings
* Add http://localhost:3000 and http://localhost:8080 as Logout redirect URIs, then save again
* Open backend folder with IntelliJ IDEA
* Create application.yml file inside src/main/resources/
* Copy and paste the URI of your default authorization server, client ID, and the client secret and add it to the file like this: 

```java
spring:
  security:
    oauth2:
      client:
        registration:
          okta:
            client-id: {clientId}
            client-secret: {clientSecret}
            scope: openid, email, profile
        provider:
          okta:
            issuer-uri: https://{yourOktaDomain}.okta.com/oauth2/default
```
* Install the Lombok plugin in IntelliJ IDEA > Preferences > Plugins
* Run ```./mvnw spring-boot:run```  in the Terminal to start the backend of the app 