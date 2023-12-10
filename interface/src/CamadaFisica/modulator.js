
function sine(freq = 1, fase = 0, precision = 300) {
    const xt = [];
    const yt = [];
    for (let i = 0; i < precision; i++) {
      xt.push(i / precision);
      yt.push(Math.sin((i * 2 * Math.PI * freq) / precision + fase));
    }
    return { xt, yt };
}
  
export function modulation(chartBits, chartType) {
    const { xt, yt } = sine();
    const { xt: xt_2f, yt: yt_2f } = sine(2);
    const { xt: xt_p_PI0_5, yt: yt_p_PI0_5 } = sine(1, Math.PI * 0.5);
    const { xt: xt_p_PI, yt: yt_p_PI } = sine(1, Math.PI);
    const { xt: xt_p_PI1_5, yt: yt_p_PI1_5 } = sine(1, Math.PI * 1.5);
    const x = [];
    const y = [];
    switch (chartType) {
        case "ASK":
        for (let i = 0; i < chartBits.length; i++) {
            x.push(...xt.map((x) => x + i));
            y.push(...yt.map((y) => (chartBits[i] === "1" ? y : 0)));
        }
        break;
        case "FSK":
        for (let i = 0; i < chartBits.length; i++) {
            x.push(...(chartBits[i] === "1" ? xt_2f : xt).map((x) => x + i));
            y.push(...(chartBits[i] === "1" ? yt_2f : yt));
        }
        break;
        case "QAM8":
        while (chartBits.length % 3 != 0) chartBits += 0; // garantir que temos simbolos completos
        for (let i = 0; i < chartBits.length; i += 3) {
            let j = i / 3;
            switch (chartBits.slice(i, i + 3)) {
            case "000":
                x.push(...xt.map((x) => x + j));
                y.push(...yt.map((y) => y / 2));
                break;
            case "001":
                x.push(...xt.map((x) => x + j));
                y.push(...yt.map((y) => y));
                break;
            case "010":
                x.push(...xt_p_PI0_5.map((x) => x + j));
                y.push(...yt_p_PI0_5.map((y) => y / 2));
                break;
            case "011":
                x.push(...xt_p_PI0_5.map((x) => x + j));
                y.push(...yt_p_PI0_5.map((y) => y));
                break;
            case "100":
                x.push(...xt_p_PI.map((x) => x + j));
                y.push(...yt_p_PI.map((y) => y / 2));
                break;
            case "101":
                x.push(...xt_p_PI.map((x) => x + j));
                y.push(...yt_p_PI.map((y) => y));
                break;
            case "110":
                x.push(...xt_p_PI1_5.map((x) => x + j));
                y.push(...yt_p_PI1_5.map((y) => y / 2));
                break;
            case "111":
                x.push(...xt_p_PI1_5.map((x) => x + j));
                y.push(...yt_p_PI1_5.map((y) => y));
                break;
            }
        }
        break;
    }

    return { x, y };
}