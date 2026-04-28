import { sanitizeImageSrc } from "@/utils/url";

export const MAX_PRODUCT_IMAGES = 5;
const MAX_PRODUCT_EXTRA_IMAGES = MAX_PRODUCT_IMAGES - 1;

export const getDiscountPercent = (discount) => {
  if (typeof discount === "number") return discount;
  if (typeof discount !== "string") return 0;

  const parsed = Number(discount.replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const createCommentId = () =>
  `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const hasMeaningfulProductImage = (value) => String(value || "").trim().length > 0;

export const normalizeProductImages = (images) => {
  if (!Array.isArray(images)) return [];

  return images
    .map((image) => String(image || "").trim())
    .map((image) => sanitizeImageSrc(image, ""))
    .map((image) => String(image || "").trim())
    .filter(Boolean)
    .slice(0, MAX_PRODUCT_EXTRA_IMAGES);
};

export const ensureEditableProductImages = (images) => {
  const normalizedImages = normalizeProductImages(images);

  if (
    normalizedImages.length === 0 ||
    hasMeaningfulProductImage(normalizedImages[normalizedImages.length - 1])
  ) {
    normalizedImages.push("");
  }

  return normalizedImages.slice(0, MAX_PRODUCT_EXTRA_IMAGES);
};

export const hasProductCommentContent = (comment) => {
  if (!comment || typeof comment !== "object") return false;

  return Boolean(
    String(comment.name || "").trim() ||
      String(comment.phrase || "").trim() ||
      String(comment.image || "").trim(),
  );
};

export const normalizeProductComment = (comment, index = 0) => {
  if (!comment || typeof comment !== "object") return null;

  return {
    id: String(comment.id || `${createCommentId()}-${index}`),
    name: String(comment.name || ""),
    phrase: String(comment.phrase || ""),
    image: String(comment.image || ""),
    showOnHome: comment.showOnHome === true,
  };
};

export const createEmptyProductComment = () => ({
  id: createCommentId(),
  name: "",
  phrase: "",
  image: "",
  showOnHome: false,
});

export const ensureEditableProductComments = (comments) => {
  const normalizedComments = Array.isArray(comments)
    ? comments.map(normalizeProductComment).filter(Boolean)
    : [];

  if (
    normalizedComments.length === 0 ||
    hasProductCommentContent(normalizedComments[normalizedComments.length - 1])
  ) {
    normalizedComments.push(createEmptyProductComment());
  }

  return normalizedComments;
};

export const sanitizeProductComments = (comments) => {
  if (!Array.isArray(comments)) return [];

  return comments
    .map(normalizeProductComment)
    .filter(hasProductCommentContent)
    .map((comment) => ({
      ...comment,
      name: comment.name.trim(),
      phrase: comment.phrase.trim(),
      image: sanitizeImageSrc(comment.image, ""),
    }));
};

export const prepareProductForEditor = (product) => ({
  ...product,
  imagePreview: sanitizeImageSrc(product?.image || product?.img || "", null),
  images: ensureEditableProductImages(product?.images),
  comments: ensureEditableProductComments(product?.comments).map((comment) => ({
    ...comment,
    imagePreview: sanitizeImageSrc(comment?.image, null),
  })),
});

export const prepareProductsForEditor = (products) => {
  if (!Array.isArray(products)) return [];

  return products.map(prepareProductForEditor);
};

export const prepareProductsForStorage = (products) => {
  if (!Array.isArray(products)) return [];

  return products.map((product) => ({
    ...product,
    image: sanitizeImageSrc(product?.image || product?.img || "", ""),
    imagePreview: undefined,
    images: normalizeProductImages(product?.images),
    comments: sanitizeProductComments(product?.comments),
  }));
};

export const normalizeProduct = (product) => {
  if (!product) return null;

  return {
    id: String(product.id),
    name: product.name || "Produto sem nome",
    category: String(product.category || ""),
    linha: String(product.linha || ""),
    description: product.description || "",
    price: Number(product.price || 0),
    image: sanitizeImageSrc(product.image || product.img || "/imagem1.jpg", "/imagem1.jpg"),
    discountPercent: getDiscountPercent(
      product.discountPercent ?? product.discount ?? product.discont,
    ),
    rating: Number(product.rating || 0),
    isActive: product.isActive !== false,
    images: normalizeProductImages(product.images),
    comments: sanitizeProductComments(product.comments),
  };
};

export const normalizeProducts = (products) => {
  if (!Array.isArray(products)) return [];

  return products
    .map(normalizeProduct)
    .filter((product) => product && product.isActive);
};
