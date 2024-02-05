import {setGlobalDevModeChecks} from '@veksa/reselect';

beforeAll(() => {
  setGlobalDevModeChecks({
    inputStabilityCheck: 'never',
    identityFunctionCheck: 'never',
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});
