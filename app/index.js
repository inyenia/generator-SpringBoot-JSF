'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    _s = require('underscore.string'),
    shelljs = require('shelljs'),
    scriptBase = require('../script-base'),
    packagejs = require(__dirname + '/../package.json');

var JhipsterGenerator = module.exports = function JhipsterGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(JhipsterGenerator, yeoman.generators.Base);
util.inherits(JhipsterGenerator, scriptBase);

JhipsterGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    console.log(chalk.red('\n' +
        ' _     _   ___   __  _____  ____  ___       __  _____   __    __    _    \n' +
        '| |_| | | | |_) ( (`  | |  | |_  | |_)     ( (`  | |   / /\\  / /`  | |_/ \n' +
        '|_| | |_| |_|   _)_)  |_|  |_|__ |_| \\     _)_)  |_|  /_/--\\ \\_\\_, |_| \\ \n' +
        '                             ____  ___   ___                             \n' +
        '                            | |_  / / \\ | |_)                            \n' +
        '                            |_|   \\_\\_/ |_| \\                            \n' +
        '              _    __    _       __        ___   ____  _      __        \n' +
        '             | |  / /\\  \\ \\  /  / /\\      | | \\ | |_  \\ \\  / ( (`       \n' +
        '           \\_|_| /_/--\\  \\_\\/  /_/--\\     |_|_/ |_|__  \\_\\/  _)_)       \n'));

    console.log('\nWelcome to the Yoeman JSF Generator\n');

    var prompts = [
        {
            type: 'input',
            name: 'baseName',
            validate: function (input) {
                if (/^([a-zA-Z0-9_]*)$/.test(input)) return true;
                return 'Your application name cannot contain special characters or a blank space, using the default name instead';
            },
            message: '(1/13) What is the base name of your application?',
            default: 'SpringBootJSF'
        },
        {
            type: 'input',
            name: 'packageName',
            validate: function (input) {
                if (/^([a-z_]{1}[a-z0-9_]*(\.[a-z_]{1}[a-z0-9_]*)*)$/.test(input)) return true;
                return 'The package name you have provided is not a valid Java package name.';
            },
            message: '(2/13) What is your default Java package name?',
            default: 'com.mycompany.myapp'
        },
        {
            type: 'list',
            name: 'javaVersion',
            message: '(3/13) Do you want to use Java 8?',
            choices: [
                {
                    value: '8',
                    name: 'Yes (use Java 8)'
                },
                {
                    value: '7',
                    name: 'No (use Java 7)'
                }
            ],
            default: 0
        },
        {
            type: 'list',
            name: 'authenticationType',
            message: '(4/13) Which *type* of authentication would you like to use?',
            choices: [
                {
                    value: 'cookie',
                    name: 'Cookie-Based Authentication (Session)'
                },
                {
                    value: 'token',
                    name: 'Token-Based Authentication (Oauth2)'
                }
            ],
            default: 0
        },
        {
            type: 'list',
            name: 'databaseType',
            message: '(5/13) Which *type* of database would you like to use?',
            choices: [
                {
                    value: 'sql',
                    name: 'SQL (H2, MySQL, PostgreSQL)'
                },
                {
                    value: 'mongodb',
                    name: 'NoSQL (MongoDB)'
                }
            ],
            default: 0
        },
        {
            when: function (response) {
                return response.databaseType == 'sql';
            },
            type: 'list',
            name: 'prodDatabaseType',
            message: '(6/13) Which *production* database would you like to use?',
            choices: [
                {
                    value: 'mysql',
                    name: 'MySQL'
                },
                {
                    value: 'postgresql',
                    name: 'PostgreSQL'
                }
            ],
            default: 0
        },
        {
            when: function (response) {
                return response.databaseType == 'mongodb';
            },
            type: 'list',
            name: 'prodDatabaseType',
            message: '(6/13) Which *production* database would you like to use?',
            choices: [
                {
                    value: 'mongodb',
                    name: 'MongoDB'
                }
            ],
            default: 0
        },
        {
            when: function (response) {
                return response.databaseType == 'sql';
            },
            type: 'list',
            name: 'devDatabaseType',
            message: '(7/13) Which *development* database would you like to use?',
            choices: [
                {
                    value: 'h2Memory',
                    name: 'H2 in-memory with web console'
                },
                {
                    value: 'mysql',
                    name: 'MySQL'
                },
                {
                    value: 'postgresql',
                    name: 'PostgreSQL'
                }
            ],
            default: 0
        },
        {
            when: function (response) {
                return response.databaseType == 'mongodb';
            },
            type: 'list',
            name: 'devDatabaseType',
            message: '(7/13) Which *development* database would you like to use?',
            choices: [
                {
                    value: 'mongodb',
                    name: 'MongoDB'
                }
            ],
            default: 0
        },
        {
            when: function (response) {
                return response.databaseType == 'sql';
            },
            type: 'list',
            name: 'hibernateCache',
            message: '(8/13) Do you want to use Hibernate 2nd level cache?',
            choices: [
                {
                    value: 'no',
                    name: 'No'
                },
                {
                    value: 'ehcache',
                    name: 'Yes, with ehcache (local cache, for a single node)'
                },
                {
                    value: 'hazelcast',
                    name: 'Yes, with HazelCast (distributed cache, for multiple nodes)'
                }
            ],
            default: 1
        },
        {
            when: function (response) {
                return response.databaseType == 'mongodb';
            },
            type: 'list',
            name: 'hibernateCache',
            message: '(8/13) Do you want to use Hibernate 2nd level cache?',
            choices: [
                {
                    value: 'no',
                    name: 'No (this not possible with the NoSQL option)'
                },
            ],
            default: 0
        },
        {
            type: 'list',
            name: 'clusteredHttpSession',
            message: '(9/13) Do you want to use clustered HTTP sessions?',
            choices: [
                {
                    value: 'no',
                    name: 'No'
                },
                {
                    value: 'hazelcast',
                    name: 'Yes, with HazelCast'
                }
            ],
            default: 0
        },
        {
            type: 'list',
            name: 'websocket',
            message: '(10/13) Do you want to use WebSockets?',
            choices: [
                {
                    value: 'no',
                    name: 'No'
                },
                {
                    value: 'spring-websocket',
                    name: 'Yes, with Spring Websocket'
                }
            ],
            default: 0
        }
    ];

    this.baseName = this.config.get('baseName');
    this.packageName = this.config.get('packageName');
    this.authenticationType = this.config.get('authenticationType');
    this.hibernateCache = this.config.get('hibernateCache');
    this.clusteredHttpSession = this.config.get('clusteredHttpSession');
    this.websocket = this.config.get('websocket');
    this.databaseType = this.config.get('databaseType');
    this.devDatabaseType = this.config.get('devDatabaseType');
    this.prodDatabaseType = this.config.get('prodDatabaseType');
    this.useCompass = this.config.get('useCompass');
    this.javaVersion = this.config.get('javaVersion');
    this.buildTool = this.config.get('buildTool');
    this.frontendBuilder = this.config.get('frontendBuilder');
    this.packagejs = packagejs;

    if (this.baseName != null &&
        this.packageName != null &&
        this.authenticationType != null &&
        this.hibernateCache != null &&
        this.clusteredHttpSession != null &&
        this.websocket != null &&
        this.databaseType != null &&
        this.devDatabaseType != null &&
        this.prodDatabaseType != null &&
        this.useCompass != null &&
        this.buildTool != null &&
        this.frontendBuilder != null &&
        this.javaVersion != null) {

        console.log(chalk.green('This is an existing project, using the configuration from your .yo-rc.json file \n' +
            'to re-generate the project...\n'));

        cb();
    } else {
        this.prompt(prompts, function (props) {
            this.baseName = props.baseName;
            this.packageName = props.packageName;
            this.authenticationType = props.authenticationType;
            this.hibernateCache = props.hibernateCache;
            this.clusteredHttpSession = props.clusteredHttpSession;
            this.websocket = props.websocket;
            this.databaseType = props.databaseType;
            this.devDatabaseType = props.devDatabaseType;
            this.prodDatabaseType = props.prodDatabaseType;
            this.useCompass = props.useCompass;
            this.buildTool = props.buildTool;
            this.frontendBuilder = props.frontendBuilder;
            this.javaVersion = props.javaVersion;

            cb();
        }.bind(this));
    }
};

JhipsterGenerator.prototype.app = function app() {

    var packageFolder = this.packageName.replace(/\./g, '/');
    var javaDir = 'src/main/java/' + packageFolder + '/';
    var resourceDir = 'src/main/resources/';
    var webappDir = 'src/main/webapp/';

    var javaPackageDir = 'src/main/java/package/';
    var testPackageDir = 'src/test/java/package/';

    // Remove old files

    // Angular JS app
    this.angularAppName = _s.camelize(_s.slugify(this.baseName)) + 'App';

    // Create application
    this.template('_package.json', 'package.json', this, {});
    this.template('_bower.json', 'bower.json', this, {});
    this.template('_README.md', 'README.md', this, {});
    this.template('bowerrc', '.bowerrc', this, {});
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');

    switch (this.buildTool) {
        default :
            this.template('_pom.xml', 'pom.xml', null, { 'interpolate': /<%=([\s\S]+?)%>/g });
    }

    // Create Java resource files
    this.mkdir(resourceDir);
    this.copy(resourceDir + '/banner.txt', resourceDir + '/banner.txt');

    if (this.hibernateCache == "ehcache") {
        this.template(resourceDir + '_ehcache.xml', resourceDir + 'ehcache.xml', this, {});
    }
    if (this.devDatabaseType == "h2Memory") {
        this.copy(resourceDir + 'h2.server.properties', resourceDir + '.h2.server.properties');
    }

    // Thymeleaf templates
    this.copy(resourceDir + '/templates/error.html', resourceDir + 'templates/error.html');

    this.template(resourceDir + '_logback.xml', resourceDir + 'logback.xml', this, {});

    this.template(resourceDir + '/config/_application.yml', resourceDir + 'config/application.yml', this, {});
    this.template(resourceDir + '/config/_application-dev.yml', resourceDir + 'config/application-dev.yml', this, {});
    this.template(resourceDir + '/config/_application-prod.yml', resourceDir + 'config/application-prod.yml', this, {});

    if (this.databaseType == "sql") {
        this.template(resourceDir + '/config/liquibase/changelog/_initial_schema.xml', resourceDir + 'config/liquibase/changelog/00000000000000_initial_schema.xml', this, {});
        this.copy(resourceDir + '/config/liquibase/master.xml', resourceDir + 'config/liquibase/master.xml');
        this.copy(resourceDir + '/config/liquibase/users.csv', resourceDir + 'config/liquibase/users.csv');
        this.copy(resourceDir + '/config/liquibase/authorities.csv', resourceDir + 'config/liquibase/authorities.csv');
        this.copy(resourceDir + '/config/liquibase/users_authorities.csv', resourceDir + 'config/liquibase/users_authorities.csv');
    }

    if (this.databaseType == "mongodb") {
        this.copy(resourceDir + '/config/mongeez/authorities.xml', resourceDir + 'config/mongeez/authorities.xml');
        this.copy(resourceDir + '/config/mongeez/master.xml', resourceDir + 'config/mongeez/master.xml');
        this.copy(resourceDir + '/config/mongeez/users.xml', resourceDir + 'config/mongeez/users.xml');
    }

    // Create mail templates
    this.copy(resourceDir + '/mails/activationEmail.html', resourceDir + 'mails/activationEmail.html');

    // Create Java files
    this.template(javaPackageDir + '_Application.java', javaDir + '/Application.java', this, {});
    this.template(javaPackageDir + '_ApplicationWebXml.java', javaDir + '/ApplicationWebXml.java', this, {});

    this.template(javaPackageDir + 'aop/logging/_LoggingAspect.java', javaDir + 'aop/logging/LoggingAspect.java', this, {});

    this.template(javaPackageDir + 'config/apidoc/_package-info.java', javaDir + 'config/apidoc/package-info.java', this, {});
    this.template(javaPackageDir + 'config/apidoc/_SwaggerConfiguration.java', javaDir + 'config/apidoc/SwaggerConfiguration.java', this, {});

    this.template(javaPackageDir + 'async/_package-info.java', javaDir + 'async/package-info.java', this, {});
    this.template(javaPackageDir + 'async/_ExceptionHandlingAsyncTaskExecutor.java', javaDir + 'async/ExceptionHandlingAsyncTaskExecutor.java', this, {});

    this.template(javaPackageDir + 'config/_package-info.java', javaDir + 'config/package-info.java', this, {});
    this.template(javaPackageDir + 'config/_AsyncConfiguration.java', javaDir + 'config/AsyncConfiguration.java', this, {});
    this.template(javaPackageDir + 'config/_CacheConfiguration.java', javaDir + 'config/CacheConfiguration.java', this, {});
    this.template(javaPackageDir + 'config/_Constants.java', javaDir + 'config/Constants.java', this, {});
    this.template(javaPackageDir + 'config/_CloudDatabaseConfiguration.java', javaDir + 'config/CloudDatabaseConfiguration.java', this, {});
    if (this.databaseType == 'mongodb') {
        this.template(javaPackageDir + 'config/_CloudMongoDbConfiguration.java', javaDir + 'config/CloudMongoDbConfiguration.java', this, {});
    }
    this.template(javaPackageDir + 'config/_DatabaseConfiguration.java', javaDir + 'config/DatabaseConfiguration.java', this, {});
    this.template(javaPackageDir + 'config/_JacksonConfiguration.java', javaDir + 'config/JacksonConfiguration.java', this, {});
    this.template(javaPackageDir + 'config/_LocaleConfiguration.java', javaDir + 'config/LocaleConfiguration.java', this, {});
    this.template(javaPackageDir + 'config/_LoggingAspectConfiguration.java', javaDir + 'config/LoggingAspectConfiguration.java', this, {});
    this.template(javaPackageDir + 'config/_MailConfiguration.java', javaDir + 'config/MailConfiguration.java', this, {});
    this.template(javaPackageDir + 'config/_MetricsConfiguration.java', javaDir + 'config/MetricsConfiguration.java', this, {});

    if (this.authenticationType == 'token') {
        this.template(javaPackageDir + 'config/_OAuth2ServerConfiguration.java', javaDir + 'config/OAuth2ServerConfiguration.java', this, {});
    }

    if (this.databaseType == 'mongodb' &&  this.authenticationType == 'token') {
        this.template(javaPackageDir + 'config/oauth2/_OAuth2AuthenticationReadConverter.java', javaDir + 'config/oauth2/OAuth2AuthenticationReadConverter.java', this, {});
        this.template(javaPackageDir + 'config/oauth2/_MongoDBTokenStore.java', javaDir + 'config/oauth2/MongoDBTokenStore.java', this, {});
        this.template(javaPackageDir + 'domain/_OAuth2AuthenticationAccessToken.java', javaDir + 'domain/OAuth2AuthenticationAccessToken.java', this, {});
        this.template(javaPackageDir + 'domain/_OAuth2AuthenticationRefreshToken.java', javaDir + 'domain/OAuth2AuthenticationRefreshToken.java', this, {});
        this.template(javaPackageDir + 'repository/_OAuth2AccessTokenRepository.java', javaDir + 'repository/OAuth2AccessTokenRepository.java', this, {});
        this.template(javaPackageDir + 'repository/_OAuth2RefreshTokenRepository.java', javaDir + 'repository/OAuth2RefreshTokenRepository.java', this, {});
    }

    this.template(javaPackageDir + 'config/_SecurityConfiguration.java', javaDir + 'config/SecurityConfiguration.java', this, {});
    this.template(javaPackageDir + 'config/_ThymeleafConfiguration.java', javaDir + 'config/ThymeleafConfiguration.java', this, {});
    this.template(javaPackageDir + 'config/_WebConfigurer.java', javaDir + 'config/WebConfigurer.java', this, {});
    if (this.websocket == 'spring-websocket') {
        this.template(javaPackageDir + 'config/_WebsocketConfiguration.java', javaDir + 'config/WebsocketConfiguration.java', this, {});
    }

    this.template(javaPackageDir + 'config/audit/_package-info.java', javaDir + 'config/audit/package-info.java', this, {});
    this.template(javaPackageDir + 'config/audit/_AuditEventConverter.java', javaDir + 'config/audit/AuditEventConverter.java', this, {});

    this.template(javaPackageDir + 'config/locale/_package-info.java', javaDir + 'config/locale/package-info.java', this, {});
    this.template(javaPackageDir + 'config/locale/_AngularCookieLocaleResolver.java', javaDir + 'config/locale/AngularCookieLocaleResolver.java', this, {});

    this.template(javaPackageDir + 'config/metrics/_package-info.java', javaDir + 'config/metrics/package-info.java', this, {});
    this.template(javaPackageDir + 'config/metrics/_DatabaseHealthIndicator.java', javaDir + 'config/metrics/DatabaseHealthIndicator.java', this, {});
    this.template(javaPackageDir + 'config/metrics/_JavaMailHealthIndicator.java', javaDir + 'config/metrics/JavaMailHealthIndicator.java', this, {});
    this.template(javaPackageDir + 'config/metrics/_JHipsterHealthIndicatorConfiguration.java', javaDir + 'config/metrics/JHipsterHealthIndicatorConfiguration.java', this, {});

    if (this.hibernateCache == "hazelcast") {
        this.template(javaPackageDir + 'config/hazelcast/_HazelcastCacheRegionFactory.java', javaDir + 'config/hazelcast/HazelcastCacheRegionFactory.java', this, {});
        this.template(javaPackageDir + 'config/hazelcast/_package-info.java', javaDir + 'config/hazelcast/package-info.java', this, {});
    }

    this.template(javaPackageDir + 'domain/_package-info.java', javaDir + 'domain/package-info.java', this, {});
    this.template(javaPackageDir + 'domain/_AbstractAuditingEntity.java', javaDir + 'domain/AbstractAuditingEntity.java', this, {});
    this.template(javaPackageDir + 'domain/_Authority.java', javaDir + 'domain/Authority.java', this, {});
    this.template(javaPackageDir + 'domain/_PersistentAuditEvent.java', javaDir + 'domain/PersistentAuditEvent.java', this, {});
    if (this.authenticationType == 'cookie') {
        this.template(javaPackageDir + 'domain/_PersistentToken.java', javaDir + 'domain/PersistentToken.java', this, {});
    }
    this.template(javaPackageDir + 'domain/_User.java', javaDir + 'domain/User.java', this, {});
    this.template(javaPackageDir + 'domain/util/_CustomLocalDateSerializer.java', javaDir + 'domain/util/CustomLocalDateSerializer.java', this, {});
    this.template(javaPackageDir + 'domain/util/_CustomDateTimeSerializer.java', javaDir + 'domain/util/CustomDateTimeSerializer.java', this, {});
    this.template(javaPackageDir + 'domain/util/_CustomDateTimeDeserializer.java', javaDir + 'domain/util/CustomDateTimeDeserializer.java', this, {});
    this.template(javaPackageDir + 'domain/util/_ISO8601LocalDateDeserializer.java', javaDir + 'domain/util/ISO8601LocalDateDeserializer.java', this, {});

    this.template(javaPackageDir + 'repository/_package-info.java', javaDir + 'repository/package-info.java', this, {});
    this.template(javaPackageDir + 'repository/_AuthorityRepository.java', javaDir + 'repository/AuthorityRepository.java', this, {});
    this.template(javaPackageDir + 'repository/_CustomAuditEventRepository.java', javaDir + 'repository/CustomAuditEventRepository.java', this, {});

    this.template(javaPackageDir + 'repository/_UserRepository.java', javaDir + 'repository/UserRepository.java', this, {});

    if (this.authenticationType == 'cookie') {
        this.template(javaPackageDir + 'repository/_PersistentTokenRepository.java', javaDir + 'repository/PersistentTokenRepository.java', this, {});
    }
    this.template(javaPackageDir + 'repository/_PersistenceAuditEventRepository.java', javaDir + 'repository/PersistenceAuditEventRepository.java', this, {});

    this.template(javaPackageDir + 'security/_package-info.java', javaDir + 'security/package-info.java', this, {});
    this.template(javaPackageDir + 'security/_AjaxAuthenticationFailureHandler.java', javaDir + 'security/AjaxAuthenticationFailureHandler.java', this, {});
    this.template(javaPackageDir + 'security/_AjaxAuthenticationSuccessHandler.java', javaDir + 'security/AjaxAuthenticationSuccessHandler.java', this, {});
    this.template(javaPackageDir + 'security/_AjaxLogoutSuccessHandler.java', javaDir + 'security/AjaxLogoutSuccessHandler.java', this, {});
    this.template(javaPackageDir + 'security/_AuthoritiesConstants.java', javaDir + 'security/AuthoritiesConstants.java', this, {});
    if (this.authenticationType == 'cookie') {
        this.template(javaPackageDir + 'security/_CustomPersistentRememberMeServices.java', javaDir + 'security/CustomPersistentRememberMeServices.java', this, {});
    }
    this.template(javaPackageDir + 'security/_Http401UnauthorizedEntryPoint.java', javaDir + 'security/Http401UnauthorizedEntryPoint.java', this, {});
    this.template(javaPackageDir + 'security/_SecurityUtils.java', javaDir + 'security/SecurityUtils.java', this, {});
    this.template(javaPackageDir + 'security/_SpringSecurityAuditorAware.java', javaDir + 'security/SpringSecurityAuditorAware.java', this, {});
    this.template(javaPackageDir + 'security/_UserDetailsService.java', javaDir + 'security/UserDetailsService.java', this, {});
    this.template(javaPackageDir + 'security/_UserNotActivatedException.java', javaDir + 'security/UserNotActivatedException.java', this, {});

    this.template(javaPackageDir + 'service/_package-info.java', javaDir + 'service/package-info.java', this, {});
    this.template(javaPackageDir + 'service/_AuditEventService.java', javaDir + 'service/AuditEventService.java', this, {});
    this.template(javaPackageDir + 'service/_UserService.java', javaDir + 'service/UserService.java', this, {});
    this.template(javaPackageDir + 'service/_MailService.java', javaDir + 'service/MailService.java', this, {});
    this.template(javaPackageDir + 'service/util/_RandomUtil.java', javaDir + 'service/util/RandomUtil.java', this, {});

    this.template(javaPackageDir + 'web/filter/_package-info.java', javaDir + 'web/filter/package-info.java', this, {});
    this.template(javaPackageDir + 'web/filter/_CachingHttpHeadersFilter.java', javaDir + 'web/filter/CachingHttpHeadersFilter.java', this, {});
    this.template(javaPackageDir + 'web/filter/_StaticResourcesProductionFilter.java', javaDir + 'web/filter/StaticResourcesProductionFilter.java', this, {});
    if (this.authenticationType == 'cookie') {
        this.template(javaPackageDir + 'web/filter/_CsrfCookieGeneratorFilter.java', javaDir + 'web/filter/CsrfCookieGeneratorFilter.java', this, {});
    }

    this.template(javaPackageDir + 'web/filter/gzip/_package-info.java', javaDir + 'web/filter/gzip/package-info.java', this, {});
    this.template(javaPackageDir + 'web/filter/gzip/_GzipResponseHeadersNotModifiableException.java', javaDir + 'web/filter/gzip/GzipResponseHeadersNotModifiableException.java', this, {});
    this.template(javaPackageDir + 'web/filter/gzip/_GZipResponseUtil.java', javaDir + 'web/filter/gzip/GZipResponseUtil.java', this, {});
    this.template(javaPackageDir + 'web/filter/gzip/_GZipServletFilter.java', javaDir + 'web/filter/gzip/GZipServletFilter.java', this, {});
    this.template(javaPackageDir + 'web/filter/gzip/_GZipServletOutputStream.java', javaDir + 'web/filter/gzip/GZipServletOutputStream.java', this, {});
    this.template(javaPackageDir + 'web/filter/gzip/_GZipServletResponseWrapper.java', javaDir + 'web/filter/gzip/GZipServletResponseWrapper.java', this, {});

    this.template(javaPackageDir + 'web/propertyeditors/_package-info.java', javaDir + 'web/propertyeditors/package-info.java', this, {});
    this.template(javaPackageDir + 'web/propertyeditors/_LocaleDateTimeEditor.java', javaDir + 'web/propertyeditors/LocaleDateTimeEditor.java', this, {});

    this.template(javaPackageDir + 'web/rest/dto/_package-info.java', javaDir + 'web/rest/dto/package-info.java', this, {});
    this.template(javaPackageDir + 'web/rest/dto/_LoggerDTO.java', javaDir + 'web/rest/dto/LoggerDTO.java', this, {});
    this.template(javaPackageDir + 'web/rest/dto/_UserDTO.java', javaDir + 'web/rest/dto/UserDTO.java', this, {});
    this.template(javaPackageDir + 'web/rest/_package-info.java', javaDir + 'web/rest/package-info.java', this, {});
    this.template(javaPackageDir + 'web/rest/_AccountResource.java', javaDir + 'web/rest/AccountResource.java', this, {});
    this.template(javaPackageDir + 'web/rest/_AuditResource.java', javaDir + 'web/rest/AuditResource.java', this, {});
    this.template(javaPackageDir + 'web/rest/_LogsResource.java', javaDir + 'web/rest/LogsResource.java', this, {});
    this.template(javaPackageDir + 'web/rest/_UserResource.java', javaDir + 'web/rest/UserResource.java', this, {});

    if (this.websocket == 'spring-websocket') {
        this.template(javaPackageDir + 'web/websocket/_package-info.java', javaDir + 'web/websocket/package-info.java', this, {});
        this.template(javaPackageDir + 'web/websocket/_ActivityService.java', javaDir + 'web/websocket/ActivityService.java', this, {});
        this.template(javaPackageDir + 'web/websocket/dto/_package-info.java', javaDir + 'web/websocket/dto/package-info.java', this, {});
        this.template(javaPackageDir + 'web/websocket/dto/_ActivityDTO.java', javaDir + 'web/websocket/dto/ActivityDTO.java', this, {});
    }

    // Create Test Java files
    var testDir = 'src/test/java/' + packageFolder + '/';
    var testResourceDir = 'src/test/resources/';
    this.mkdir(testDir);

    if (this.databaseType == "mongodb") {
        this.template(testPackageDir + 'config/_MongoConfiguration.java', testDir + 'config/MongoConfiguration.java', this, {});
    }
    this.template(testPackageDir + 'security/_SecurityUtilsTest.java', testDir + 'security/SecurityUtilsTest.java', this, {});
    this.template(testPackageDir + 'service/_UserServiceTest.java', testDir + 'service/UserServiceTest.java', this, {});
    this.template(testPackageDir + 'web/rest/_AccountResourceTest.java', testDir + 'web/rest/AccountResourceTest.java', this, {});
    this.template(testPackageDir + 'web/rest/_TestUtil.java', testDir + 'web/rest/TestUtil.java', this, {});
    this.template(testPackageDir + 'web/rest/_UserResourceTest.java', testDir + 'web/rest/UserResourceTest.java', this, {});

    this.template(testResourceDir + 'config/_application.yml', testResourceDir + 'config/application.yml', this, {});
    this.template(testResourceDir + '_logback-test.xml', testResourceDir + 'logback-test.xml', this, {});

    if (this.hibernateCache == "ehcache") {
        this.template(testResourceDir + '_ehcache.xml', testResourceDir + 'ehcache.xml', this, {});
    }

    // Create Webapp
    this.mkdir(webappDir);

    // HTML5 BoilerPlate
    this.copy(webappDir + 'favicon.ico', webappDir + 'favicon.ico');
    this.copy(webappDir + 'robots.txt', webappDir + 'robots.txt');
    this.copy(webappDir + 'htaccess.txt', webappDir + '.htaccess');

    // install all files related to i18n
    this.installI18nFilesByLanguage(this, webappDir, resourceDir, 'en');
    this.installI18nFilesByLanguage(this, webappDir, resourceDir, 'fr');

    this.config.set('baseName', this.baseName);
    this.config.set('packageName', this.packageName);
    this.config.set('packageFolder', packageFolder);
    this.config.set('authenticationType', this.authenticationType);
    this.config.set('hibernateCache', this.hibernateCache);
    this.config.set('clusteredHttpSession', this.clusteredHttpSession);
    this.config.set('websocket', this.websocket);
    this.config.set('databaseType', this.databaseType);
    this.config.set('devDatabaseType', this.devDatabaseType);
    this.config.set('prodDatabaseType', this.prodDatabaseType);
    this.config.set('useCompass', this.useCompass);
    this.config.set('buildTool', this.buildTool);
    this.config.set('frontendBuilder', this.frontendBuilder);
    this.config.set('javaVersion', this.javaVersion);
};

JhipsterGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
};

function removefile(file) {
    console.log('Remove the file - ' + file)
    if (shelljs.test('-f', file)) {
        shelljs.rm(file);
    }

}

function removefolder(folder) {
    console.log('Remove the folder - ' + folder)
    if (shelljs.test('-d', folder)) {
        shelljs.rm("-rf", folder);
    }
}
