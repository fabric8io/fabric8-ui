// import logoDarkImg from './assets/images/OSIO_logo_color_rgb_black.svg';
// import logoLightImg from './assets/images/OSIO_logo_color_rgb_white.svg';
// import brandImg from './assets/images/OSIO_symbol.svg';
// import logoDarkImg from './assets/images/codeready_toolchain_small.png';
import logoLightImg from './assets/images/codeready_toolchain_small.png';

export interface Brand {
  productName: string;
  trademark: string;
  brandImageSrc: string;
  logoDarkImageSrc: string;
  logoLightImageSrc: string;
  about?: string;
  details?: { label: string; value?: string }[];
}

const brand: Brand = {
  productName: 'CodeReady Toolchain',
  trademark: `Copyright ©${new Date().getFullYear()} Red Hat,Inc.`,
  logoDarkImageSrc: logoLightImg,
  logoLightImageSrc: logoLightImg,
  brandImageSrc: '',
  details: [
    {
      label: 'Build',
      value: process.env.BUILD_NUMBER != null ? `#${process.env.BUILD_NUMBER}` : undefined,
    },
    {
      label: 'Timestamp',
      value: process.env.BUILD_TIMESTAMP || undefined,
    },
    {
      label: 'Version',
      value: process.env.BUILD_VERSION,
    },
  ],
};

export default brand;
