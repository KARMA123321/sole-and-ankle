import React from "react";
import styled from "styled-components/macro";

import { COLORS, WEIGHTS } from "../../constants";
import { formatPrice, pluralize, isNewShoe } from "../../utils";
import Spacer from "../Spacer";

const ShoeCard = ({
  slug,
  name,
  imageSrc,
  price,
  salePrice,
  releaseDate,
  numOfColors,
}) => {
  // There are 3 variants possible, based on the props:
  //   - new-release
  //   - on-sale
  //   - default
  //
  // Any shoe released in the last month will be considered
  // `new-release`. Any shoe with a `salePrice` will be
  // on-sale. In theory, it is possible for a shoe to be
  // both on-sale and new-release, but in this case, `on-sale`
  // will triumph and be the variant used.
  // prettier-ignore
  const variant = typeof salePrice === 'number'
    ? 'on-sale'
    : isNewShoe(releaseDate)
      ? 'new-release'
      : 'default'

  const RowComponent = () =>
    variant === "on-sale"
      ? NamePriceRowOnSale(name, price, salePrice)
      : NamePriceRow(name, price);

  const ImageWrapperComponent = () => {
    switch (variant) {
      case "on-sale":
        return FlaggedImgWrapper(variant, "Sale", imageSrc);
      case "new-release":
        return FlaggedImgWrapper(variant, "Just Released", imageSrc);
      case "default":
        return ImgWrapper(imageSrc);
    }
  };

  return (
    <Link href={`/shoe/${slug}`}>
      <Wrapper>
        <ImageWrapperComponent />
        <Spacer size={12} />
        <RowComponent />
        <Row>
          <ColorInfo>{pluralize("Color", numOfColors)}</ColorInfo>
        </Row>
      </Wrapper>
    </Link>
  );
};

const NamePriceRow = (name, price) => {
  return (
    <Row>
      <Name>{name}</Name>
      <Price>{formatPrice(price)}</Price>
    </Row>
  );
};

const NamePriceRowOnSale = (name, price, salePrice) => {
  return (
    <Row>
      <Name>{name}</Name>
      <Price salePrice={salePrice}>{formatPrice(price)}</Price>
      <SalePrice>{formatPrice(salePrice)}</SalePrice>
    </Row>
  );
};

const ImgWrapper = (imageSrc, alt = "") => {
  return (
    <ImageWrapper>
      <Image alt={alt} src={imageSrc} />
    </ImageWrapper>
  );
};

const FlaggedImgWrapper = (variant, children, imageSrc, alt = "") => {
  return (
    <ImageWrapper>
      <Image alt={alt} src={imageSrc} />
      <Flag variant={variant}>{children}</Flag>
    </ImageWrapper>
  );
};

const Link = styled.a`
  text-decoration: none;
  color: inherit;
`;

const Wrapper = styled.article`
  position: relative;
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const Image = styled.img`
  width: 350px;
`;

const Row = styled.div`
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
`;

const Name = styled.h3`
  font-weight: ${WEIGHTS.medium};
  color: ${COLORS.gray[900]};
`;

const Price = styled.span`
  color: ${(p) => p.salePrice && COLORS.gray[700]};
  text-decoration: ${(p) => p.salePrice && "line-through"};
`;

const ColorInfo = styled.p`
  color: ${COLORS.gray[700]};
`;

const SalePrice = styled.span`
  font-weight: ${WEIGHTS.medium};
  color: ${COLORS.primary};
  position: absolute;
  right: 0;
  bottom: 0;
`;

const Flag = styled.div`
  font-size: calc(14 / 16)rem;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 12px;
  right: -4px;
  height: 2rem;
  width: fit-content;
  padding: 9px 11px;
  background-color: ${(p) => p.variant === "on-sale" ? COLORS.primary : COLORS.secondary};
  color: ${COLORS.white};
  border-radius: 2px;
`;

export default ShoeCard;
