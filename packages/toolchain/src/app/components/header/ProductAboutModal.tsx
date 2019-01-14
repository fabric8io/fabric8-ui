import React from 'react';
import { AboutModal, Content } from '@osio/widgets';
import heroImg from '../../../assets/images/bg1/pfbg_768.jpg';
import brand from '../../../brand';

// Include stypes to hide logo for now.
import './ProductAboutModal.scss';

export type ProductAboutModalProps = {
  onClose(): void;
  isOpen: boolean;
};

const ProductAboutModal: React.SFC<ProductAboutModalProps> = (props) => {
  const { about, productName, trademark, logoDarkImageSrc, brandImageSrc, details } = brand;
  const detailsList = (details || [])
    .map(({ label, value }) =>
      value != null ? (
        <React.Fragment key={`${label}`}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </React.Fragment>
      ) : null,
    )
    .filter((x) => x);

  return (
    <AboutModal
      {...props}
      productName={brand.productName}
      trademark={trademark || `Copyright ©${new Date().getFullYear()}`}
      heroImageSrc={heroImg}
      logoImageSrc={logoDarkImageSrc}
      logoImageAlt={productName}
      brandImageSrc={brandImageSrc}
      brandImageAlt={productName}
    >
      <Content>
        {about && <p>{about}</p>}
        {detailsList.length > 0 && <dl>{detailsList}</dl>}
      </Content>
    </AboutModal>
  );
};

export default ProductAboutModal;
