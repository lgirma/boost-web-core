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
import {DefaultSecurityService, SecurityService} from '@boots-web/core'

export default DefaultSecurityService as SecurityService;
```

### Using Dependencies

Import a dependency from the container as:

```
import _security from 'container/security';
```