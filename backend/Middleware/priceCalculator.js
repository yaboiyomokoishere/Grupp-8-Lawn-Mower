function PriceCalculator(grassHeight, WA, duration) {
    const installation = 1500
    const dayPay = 200
    if (grassHeight = 1.0){
        grassPay = 0.01
    }
    else if (grassHeight  = 0.5){
        grassPay = 0.02
    }
    else {
        grassPay = 0
    }
    if (WA <= 500){
        WAPay = 0.7
    }
    else if (WA > 500 & WA <= 1000){
        WAPay = 0.6
    }
    else {
        WAPay = 0.5
    }
    return ((grassPay+WAPay)*WA)+installation+dayPay*duration;
  }