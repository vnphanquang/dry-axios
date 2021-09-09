# DRY Axios

Utilize [typescript] decorators to create declarative http service with [axios]

## Installation

Add to project with your package manager

```bash
npm install axios dry-axios
```

```bash
yarn add axios dry-axios
```

```bash
pnpm install axios dry-axios
```

Set experimental decorators options in your `tsconfig.json`

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Example Usage

```typescript
import Axios from 'axios';
import {
  Asserted,
  Post,
  Get,
  Sample,
  Jwt,
  Http,
} from 'dry-axios;

// runtime is a config passed to certain resolvers when methods are invoked
// ext: jwtResolver, sample validate & apply. See below
type Runtime = {
  mode: 'production' | 'development';
};

@Http<Runtime>(Axios, {
  // config passed to axios.create
  axios: {
    baseURL: 'http://localhost:3005',
  },
  runtime: {
    mode: 'development',
  }
})
class AccountHttpService {
  @Get('/identity', {
    // by default, return response.data. Set preserveAxiosResponse to keep original response object
    preserveAxiosResponse: false;
    // other available options passed to axios.request
  })
  @Jwt<Runtime>((runtime) => someJwtGetter(runtime))
  async getIdentity(): Promise<IdentityResponse> {
    // method body will be ignored completely.
    // use Asserted for better typing
    return Asserted<IdentityResponse>();
  }

  @Post('/sign-up')
  @Sample<Runtime>({
    resolver: async () => {
      // resolve to a mocked response for validate or testing purposes
      // dynamic import json might help reduce bundle size during production
      // (need to set "resolveJsonModule" to true in tsconfig.json)
      const module = await import('./sign-up.sample.json');
      return module.default;
    },
    // apply the mocked response returned in resolver
    // instead of actually calling the api
    // (helpful for testing purposes)
    apply: (runtime) => runtime.mode === 'development',
    // this will validate the 'real' response against the mocked response returned in resolver
    // ex: if a field is missing or typeof is different
    validate: (runtime) => runtime.mode === 'development',
  })
  async signUp(@Body _body: SignUpRequestBody): Promise<SignUpResponse> {
    return Asserted<SignUpResponse>();
  }
}

const accountHttp = new AccountHttpService();

// later
const response = await accountHttp.signUp({ ... });
```

## Todos

- [ ] unit tests, please and thank you (like Ron Swanson needs some bacon)!

## Related

- project inspired by [axiosfit]

[typescript]: https://www.typescriptlang.org/
[axios]: https://github.com/axios/axios
[axiosfit]: https://github.com/yggdrasilts/axiosfit
