import alatCekGulaDarah from "../../public/assets/images/alat-cek-gula-darah.jpg";
import alatUkurTekananDarah from "../../public/assets/images/alat-ukur-tekanan-darah.jpeg";
import stetoskop from "../../public/assets/images/stetoskop.jpg";
import termometer from "../../public/assets/images/termometer.png";
import alkohol from "../../public/assets/images/alkohol.jpg";
import kapas from "../../public/assets/images/kapas.jpg";
import maskerMedis from "../../public/assets/images/masker-medis.jpg";
import perban from "../../public/assets/images/perban.jpg";
import plester from "../../public/assets/images/plester.jpg";
import sarungTanganMedis from "../../public/assets/images/sarung-tangan-medis.jpg";
import alatBantuDuduk from "../../public/assets/images/alat-bantu-duduk.jpg";
import kruk from "../../public/assets/images/kruk.jpg";
import kursiRoda from "../../public/assets/images/kursi-roda.jpeg";
import cairanInfus from "../../public/assets/images/cairan-infus.jpg";
import kantongUrine from "../../public/assets/images/kantong-urine.png";
import spuit from "../../public/assets/images/spuit.jpeg";
import jarumSuntik from "../../public/assets/images/jarum-suntik.jpg";
import alatSterilisasi from "../../public/assets/images/alat-sterilisasi.jpg";
import disinfektan from "../../public/assets/images/disinfektan.jpeg";
import sabunAntibakteri from "../../public/assets/images/sabun-antibakteri.jpg";
import { StaticImageData } from "next/image";

type TProduct = {
  category: string;
  url_link: string;
  items: {
    id: number;
    name: string;
    price: number;
    url: StaticImageData;
  }[];
};

export const products: TProduct[] = [
  {
    category: "Diagnostic Devices",
    url_link: "diagnostic-devices",
    items: [
      {
        id: 1,
        name: "Blood Sugar Checker",
        price: 5000,
        url: alatCekGulaDarah,
      },
      {
        id: 2,
        name: "Blood Pressure Measuring Device",
        price: 5000,
        url: alatUkurTekananDarah,
      },
      {
        id: 3,
        name: "Stethoscope",
        price: 5000,
        url: stetoskop,
      },
      {
        id: 4,
        name: "Termometer",
        price: 5000,
        url: termometer,
      },
    ],
  },
  {
    category: "General Medical Equipment",
    url_link: "general-medical-equipment",
    items: [
      {
        id: 5,
        name: "Alcohol",
        price: 5000,
        url: alkohol,
      },
      {
        id: 6,
        name: "Cotton",
        price: 5000,
        url: kapas,
      },
      {
        id: 7,
        name: "Medical Mask",
        price: 5000,
        url: maskerMedis,
      },
      {
        id: 8,
        name: "Bandage",
        price: 5000,
        url: perban,
      },
      {
        id: 9,
        name: "Plaster",
        price: 5000,
        url: plester,
      },
      {
        id: 10,
        name: "Medical Gloves",
        price: 5000,
        url: sarungTanganMedis,
      },
    ],
  },
  {
    category: "Rehabilitation Equipment",
    url_link: "rehabilitation-equipment",
    items: [
      {
        id: 11,
        name: "Sitting Aid",
        price: 5000,
        url: alatBantuDuduk,
      },
      {
        id: 12,
        name: "Crutch",
        price: 5000,
        url: kruk,
      },
      {
        id: 13,
        name: "Wheel Cair",
        price: 5000,
        url: kursiRoda,
      },
    ],
  },
  {
    category: "Nursing Equipment",
    url_link: "nursing-equipment",
    items: [
      {
        id: 14,
        name: "Infusion Fluid",
        price: 5000,
        url: cairanInfus,
      },
      {
        id: 15,
        name: "Urine Bag",
        price: 5000,
        url: kantongUrine,
      },
      {
        id: 16,
        name: "Spuit",
        price: 5000,
        url: spuit,
      },
      {
        id: 17,
        name: "Syringe",
        price: 5000,
        url: jarumSuntik,
      },
    ],
  },
  {
    category: "Hygienic Equipment",
    url_link: "hygienic-equipment",
    items: [
      {
        id: 18,
        name: "Sterilizer",
        price: 5000,
        url: alatSterilisasi,
      },
      {
        id: 19,
        name: "Disinfectan",
        price: 5000,
        url: disinfektan,
      },
      {
        id: 20,
        name: "Antibacterial Soap",
        price: 5000,
        url: sabunAntibakteri,
      },
    ],
  },
];
