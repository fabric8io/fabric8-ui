import React from 'react';
import { PageSection } from '@osio/widgets';
import { Route, Switch } from 'react-router';
import Fabric8UiPage from '../pages/Fabric8UiPage';
import SpaceDropdownPageSection from '../SpaceDropdownPageSection';
import withContext, { WithContextProps } from '../../hoc/withContext';
import { NO_SPACE_PATH } from '../../redux/context/constants';

type Props = WithContextProps;

export const PageContent: React.SFC<Props> = ({
  username,
  spacename,
  spacenamePath,
  subPath,
}: Props) => {
  const spaceContext = {
    username,
    spacename,
    subPath,
  };
  return (
    <>
      <Switch>
        <Route path={`/:username/${spacenamePath}`}>
          <SpaceDropdownPageSection {...spaceContext} />
        </Route>
        <Route path="/_home" exact>
          <SpaceDropdownPageSection {...spaceContext} subPath={undefined} />
        </Route>
        <Route path="/" exact>
          <SpaceDropdownPageSection {...spaceContext} subPath={undefined} />
        </Route>
      </Switch>
      <Switch>
        <Route path={`/:username/${NO_SPACE_PATH}`}>
          <PageSection>Please select a space.</PageSection>
        </Route>
        <Route path="/" component={Fabric8UiPage} />
      </Switch>
    </>
  );
};

export default withContext(PageContent);
