import React from 'react';
import { asyncComponent, PageSection, PageSectionVariants } from '@osio/widgets';

const AsyncEmbedAngularFabric8UI = asyncComponent({
  loader: () => import('../f8ui/EmbedAngularFabric8UI'),
});

export const Fabric8UiPage: React.SFC = () => (
  <PageSection variant={PageSectionVariants.default} padding="none">
    <AsyncEmbedAngularFabric8UI />
  </PageSection>
);

export default Fabric8UiPage;
