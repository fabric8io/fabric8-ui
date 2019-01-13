import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import {
  BackgroundImage,
  BackgroundImageSrc,
  Page,
  PageHeader,
  PageSidebar,
  backgroundFilterImage,
} from '@osio/widgets';
import { global_breakpoint_md as breakpointMd } from '@patternfly/react-tokens';
import PageContent from './PageContent';
import brand from '../../../brand';
import Navigation from '../nav/Navigation';
import Header from '../header/Header';
import LoggedInUserAvatar from '../header/LoggedInUserAvatar';

import backgroundImageLg from '../../../assets/images/bg1/pfbg_1200.jpg';
import backgroundImageSm from '../../../assets/images/bg1/pfbg_768.jpg';
import backgroundImageSm2x from '../../../assets/images/bg1/pfbg_768@2x.jpg';
import backgroundImageXs from '../../../assets/images/bg1/pfbg_576.jpg';
import backgroundImageXs2x from '../../../assets/images/bg1/pfbg_576@2x.jpg';

const backgroundImages = {
  [BackgroundImageSrc.lg]: backgroundImageLg,
  [BackgroundImageSrc.sm]: backgroundImageSm,
  [BackgroundImageSrc.sm2x]: backgroundImageSm2x,
  [BackgroundImageSrc.xs]: backgroundImageXs,
  [BackgroundImageSrc.xs2x]: backgroundImageXs2x,
  [BackgroundImageSrc.filter]: `${backgroundFilterImage}#image_overlay`,
};

type Props = RouteComponentProps;

interface State {
  isNavOpen: boolean;
}

class AppLayout extends Component<Props, State> {
  state = {
    // workaround issue: https://github.com/patternfly/patternfly-react/issues/913
    isNavOpen:
      typeof window !== 'undefined' && window.innerWidth >= parseInt(breakpointMd.value, 10),
  };

  render() {
    const { history } = this.props;
    const { isNavOpen } = this.state;
    const header = (
      <PageHeader
        showNavToggle
        onNavToggle={this.onToggleNav}
        logo={
          <img src={brand.logoLightImageSrc} alt={brand.productName} style={{ maxHeight: 52 }} />
        }
        logoProps={{
          href: '/',
          onClick: (e) => {
            history.push('/');
            e.preventDefault();
          },
        }}
        toolbar={<Header />}
        avatar={<LoggedInUserAvatar />}
      />
    );
    const sidebar = <PageSidebar isNavOpen={isNavOpen} nav={<Navigation />} />;
    return (
      <>
        <BackgroundImage src={backgroundImages} />
        <Page header={header} sidebar={sidebar}>
          <PageContent />
        </Page>
      </>
    );
  }

  private onToggleNav = () => {
    const { isNavOpen } = this.state;
    this.setState({ isNavOpen: !isNavOpen });
  };
}

export default withRouter(AppLayout);
