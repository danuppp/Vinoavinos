const productos = [
    {
      id: 1,
      img: "./assets/img/GranReserva.jpg",
      name: "Tarapaca",
      price: "$25.99",
      year: 2015,
      grape: "Cabernet Sauvignon"
    },
    {
      id: 2,
      img: "./assets/img/EleganciaTinta.webp",
      name: "Bruma",
      price: "$22.50",
      year: 2015,
      grape: "Merlot"
    },
    {
      id: 3,
      img: "./assets/img/RobleIntenso.webp",
      name: "Trus",
      price: "$18.75",
      year: 2018,
      grape: "Malbec"
    },
    {
      id: 4,
      img: "./assets/img/ReservaPrivada.jpg",
      name: "Casillero del Diablo",
      price: "$30.25",
      year: 2016,
      grape: "Syrah"
    },
    {
      id: 5,
      img: "./assets/img/VinoDeAutor.webp",
      name: "Ladron de Guevara",
      price: "$28.90",
      year: 2019,
      grape: "Pinot Noir"
    },
    {
      id: 6,
      img: "./assets/img/RoséEcléctico.webp",
      name: "Rosé Eléctrico",
      price: "$19.95",
      year: 2020,
      grape: "Garnacha"
    },
    {
      id: 7,
      img: "./assets/img/RosadoSuave.jpg",
      name: "Dulce",
      price: "$16.80",
      year: 2019,
      grape: "Cinsault"
    },
    {
      id: 8,
      img: "./assets/img/EuforiaRosada.png",
      name: "Eufória",
      price: "$24.50",
      year: 2021,
      grape: "Tempranillo"
    },
    {
      id: 9,
      img: "./assets/img/RosadoSecreto.webp",
      name: "Rosé Secreto",
      price: "$21.25",
      year: 2018,
      grape: "Sangiovese"
    },
    {
      id: 10,
      img: "./assets/img/HarmoníaRosé.png",
      name: "Armonía",
      price: "$26.80",
      year: 2017,
      grape: "Zinfandel"
    },
    {
      id: 11,
      img: "./assets/img/BlancoBrillante.webp",
      name: "La Cetto",
      price: "$19.99",
      year: 2020,
      grape: "Sauvignon Blanc"
    },
    {
      id: 12,
      img: "./assets/img/ChardonnayElegante.webp",
      name: "Mènage à Trois",
      price: "$22.75",
      year: 2019,
      grape: "Chardonnay"
    },
    {
      id: 13,
      img: "./assets/img/RieslingFresco.webp",
      name: "Blue NUN",
      price: "$18.50",
      year: 2021,
      grape: "Riesling"
    },
    {
      id: 14,
      img: "./assets/img/BlancoDelValle.jpg",
      name: "F.Chauvenet",
      price: "$24.90",
      year: 2018,
      grape: "Albariño"
    },
    {
      id: 15,
      img: "./assets/img/ViognierExquisito.jpg",
      name: "Valle García",
      price: "$17.30",
      year: 2017,
      grape: "Viognier"
    },
    {
      id: 16,
      img: "./assets/img/BlancoBrillante.webp",
      name: "La Cetto",
      price: "$19.99",
      year: 2020,
      grape: "Sauvignon Blanc"
    }
  ];
  
const storedProductos = JSON.parse(localStorage.getItem("productos"));

