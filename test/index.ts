/* eslint-disable class-methods-use-this */
import Axios from 'axios';

import {
  Asserted,
  Get,
  Sample,
  Http,
} from '../lib';

type Runtime = {
  mode: 'production' | 'development';
};

type SampleResponse = {
  sample: boolean;
};

// TODO: implement jest unit tests
@Http<Runtime>(Axios, {
  axios: {
    baseURL: 'http://localhost:5678',
  },
  runtime: {
    mode: 'production',
  },
})
class ApiService {
  @Get('/sample')
  @Sample<Runtime>({
    resolver: async () => {
      const module = await import('./sample.json');
      return module.default;
    },
    validate: (runtime) => runtime.mode === 'development',
    apply: (runtime) => runtime.mode === 'development',
  })
  async sample(): Promise<SampleResponse> {
    return Asserted<SampleResponse>();
  }
}

const service = new ApiService();

async function test() {
  const response = await service.sample();
  console.log(response);
}

test();
