# @boost-web/core

Web development utilities base to boost productivity

## Installation

Using npm:

```
npm install --save-dev @boost-web/core
```

## Usage

### Setup Dependencies

Add a `container/` directory in your source root (Usually `src/` directory)

Then, add your dependencies with one file per dependency. For example, to add security:

```
src/
    container/
        security.ts
```

Contents of `security.ts` file:

```
import {DefaultSecurityService, SecurityService} from '@boost-web/core'

export default DefaultSecurityService as SecurityService;
```

### Using Dependencies

Import a dependency from the container as:

```
import _securityService from 'container/security';
```

## Available Abstract Services

- `ApplicationService`
- `ConfigService`
- `HttpService`
- `i18nService`
- Security
    - `SecurityService`
    - `AuthService`
- User interface
    - `BusyBarService`
    - `ColorService`
    - `IconService`
    - `DialogService`
    - `IconService`
    - `ModalService`
    - `FormService`
    - `FormValidationService`
    
## Available Implementations

- `ApplicationService` - `SvelteApp`
- `ConfigService` - `GetDefaultConfigService()`
- `HttpService` - `FetchHttpService` uses browser's builtin `fetch()` method
- `i18nService` - `DefaultI18nService`
- Security
    - `SecurityService` - `DefaultSecurityService`
    - `AuthService` - `DefaultAuthService`
- User interface
    - `BusyBarService` - From `@boost-web/plugin-topbar` package use `TopBarService`
    - `ColorService` - Use `@boost-web/plugin-bootstrap` package
    - `IconService` - Use `@boost-web/plugin-fontawesome` package
    - `DialogService` - Use `@boost-web/plugin-bootstrap` package
    - `ModalService` - Use `@boost-web/plugin-bootstrap` package
    - `FormService` - Use `@boost-web/plugin-bootstrap` package
    - `FormValidationService` - Use `@boost-web/plugin-bootstrap` package