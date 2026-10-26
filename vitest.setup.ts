import { setGlobalDevModeChecks } from '@veksa/reselect';
import { beforeAll } from 'vitest';

beforeAll(() => {
  setGlobalDevModeChecks({
    inputStabilityCheck: 'never',
    identityFunctionCheck: 'never',
  });
});
