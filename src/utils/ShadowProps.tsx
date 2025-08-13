const shadowProp = (elavation: number, shadowColor: string = '#000000') => {
  return {
    shadowColor: shadowColor,
    shadowOffset: {
      width: 0,
      height: Math.floor(elavation / 2),
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: elavation,
  };
};

export default shadowProp;
