export type GalleryItem = {
  id: string;
  src: string; // file inside /public/gallery
  alt: string; // describes the photo for screen readers
  title: string;
  location: string;
  type: "Plantation" | "Cleanup" | "Donation" | "Education" | "Health";
  size: "large" | "wide" | "small"; // decides how many grid cells the tile takes
  position?: string; // optional crop focus, e.g. "center 30%"
};

// STATIC DATA (the assignment requires a static gallery).
// ORDER MATTERS: large first, six small, wide last. The bento grid relies on it.
// REPLACE: swap the files in /public/gallery with your own photos anytime.
export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    src: "/tree-plantation.jpg",
    alt: "Volunteers planting young trees together in a park",
    title: "Tree Plantation",
    location: "Chattogram",
    type: "Plantation",
    size: "large",
  },
  {
    id: "g2",
    src: "/food-donation.jpg",
    alt: "Volunteers handing out meals to people in need",
    title: "Food Donation",
    location: "Dhaka",
    type: "Donation",
    size: "small",
  },
  {
    id: "g3",
    src: "/clothes-donation.jpg",
    alt: "Boxes of donated winter clothes ready for distribution",
    title: "Winter Clothes Drive",
    location: "Mirpur 10, Dhaka",
    type: "Donation",
    size: "small",
  },
  {
    id: "g4",
    src: "/educational-support.jpg",
    alt: "A volunteer teaching a group of children",
    title: "Educational Support",
    location: "Rajshahi",
    type: "Education",
    size: "small",
  },
  {
    id: "g5",
    src: "/blood-donation.jpg",
    alt: "People donating blood at a community camp",
    title: "Blood Donation Camp",
    location: "Cumilla",
    type: "Health",
    size: "small",
  },
  {
    id: "g6",
    src: "/street-cleanup.jpg",
    alt: "Volunteers in gloves cleaning a neighborhood street",
    title: "Neighborhood Cleanup",
    location: "Khulna",
    type: "Cleanup",
    size: "small",
  },
  {
    id: "g7",
    src: "/seedling-day.jpg",
    alt: "Hands planting a small seedling in the soil",
    title: "Seedling Day",
    location: "Barishal",
    type: "Plantation",
    size: "small",
  },
  {
    id: "g8",
    src: "/beach-cleanup.jpg",
    alt: "Volunteers collecting litter along a beach",
    title: "Community Cleanup",
    location: "Patenga",
    type: "Cleanup",
    size: "wide",
    position: "center 40%", // tweak if the crop cuts the subject
  },
];
