# TrickShare - Sustainable Repository

## 🌱 Sustainability Improvements

This repository has been optimized for sustainability and maintainability:

### ✅ Removed Unnecessary Files

**Duplicate/Unused Configuration:**
- `next.config.optimized.js` - Duplicate config file
- `jest.config.js` - No tests in project

**Unused Authentication Files:**
- `lib/oidc-auth.ts` - Duplicate auth implementation
- `lib/simple-oidc.ts` - Unused auth helper
- `lib/cognito-direct.ts` - Redundant auth file

**Unused Library Files:**
- `lib/db-optimized.ts` - Functionality merged into api-client
- `lib/realtime-stack.ts` - Unused real-time features
- `lib/cache.ts` - Caching moved to api-client

**Unused Components:**
- `components/ReadabilityEnhancer.tsx` - Not used
- `components/Banner.tsx` - Not used
- `components/Timer.tsx` - Not used
- `components/MobileNav.tsx` - Functionality in main header
- `components/UserRace.tsx` - Not used
- `components/Statistics.tsx` - Not used

**Unused Styles:**
- `styles/layout-fix.css` - Redundant styles

**Unused Scripts:**
- `scripts/add-more-users.js` - Development only
- `scripts/add-more-data.js` - Development only
- `scripts/add-more-tricks.js` - Development only
- `scripts/setup-kudos-table.js` - Development only
- `scripts/test-kudos.js` - Development only
- `scripts/index-database.js` - Development only

### 📦 Optimized Dependencies

**Removed Unused Dependencies:**
- `@aws-amplify/ui-react` - Not used
- `@aws-sdk/client-s3` - No S3 functionality
- `aws-amplify` - Using direct AWS SDK
- `bcryptjs` - No password hashing
- `formidable` - No file uploads
- `jsonwebtoken` - Using Cognito tokens
- `ws` - No WebSocket functionality
- `aws-cdk-lib` - No CDK deployment
- `constructs` - No CDK deployment
- `ts-node` - Not needed in production

### 🎯 Current Architecture

**Core Dependencies (Production):**
- `next` - React framework
- `react` & `react-dom` - UI library
- `@aws-sdk/*` - AWS services (DynamoDB, Cognito)
- `uuid` - ID generation
- `zod` - Validation

**Development Dependencies:**
- `typescript` - Type safety
- `eslint` - Code quality
- `husky` - Git hooks

### 📊 Impact

**Before Cleanup:**
- 25+ unused files
- 15+ unnecessary dependencies
- Complex authentication setup
- Duplicate functionality

**After Cleanup:**
- Streamlined codebase
- Essential dependencies only
- Single authentication flow
- Clear separation of concerns

### 🚀 Benefits

1. **Faster Builds**: Fewer dependencies to process
2. **Smaller Bundle**: Reduced JavaScript payload
3. **Better Maintainability**: Less code to maintain
4. **Clearer Architecture**: Single responsibility principle
5. **Reduced Security Surface**: Fewer dependencies to monitor
6. **Lower Resource Usage**: Less memory and CPU consumption

### 📝 Maintenance Guidelines

**Adding New Dependencies:**
1. Check if functionality exists in current stack
2. Prefer native solutions over external libraries
3. Evaluate bundle size impact
4. Consider long-term maintenance

**Code Organization:**
1. Keep components focused and single-purpose
2. Consolidate similar functionality
3. Remove unused imports and exports
4. Regular dependency audits

**Performance Monitoring:**
1. Monitor bundle size with each release
2. Track Core Web Vitals
3. Regular performance audits
4. Optimize based on real usage data

This sustainable approach ensures the repository remains maintainable, performant, and cost-effective for long-term development.
