export function checkBitCount(data: string): string {
    let bits = data;
    let checkHeader = 0;
    let bitsSaida = ""

    for(let i = 0; i>= 0; i += 71) {
        bits = data.slice(i+7, i+71);
        checkHeader = parseInt(data.slice(i, i+7), 2);
        if(checkHeader != bits.length) {
            throw("Deu erro com header, há interferência")
        }
        bitsSaida = bitsSaida.concat(bits);
        if(i+71 >= data.length) {
            return bitsSaida
        }
    }

    let frameSize = 64;
    return "Erro na função a qual faz a retiragem e checagem dos quadros";
}

export function checkWordCount(data: string): string {
    let bits = data;
    let checkHeader = 0;
    let bitsSaida = ""

    for(let i = 0; i>= 0; i += 71) {
        bits = data.slice(i+7, i+71);
        checkHeader = parseInt(data.slice(i, i+7), 2);
        if(checkHeader*32 < bits.length) {
            throw("Deu erro com header, há interferência")
        }
        bitsSaida = bitsSaida.concat(bits);
        if(i+71 >= data.length) {
            return bitsSaida
        }
    }

    let frameSize = 64;
    return "Erro na função a qual faz a retiragem e checagem dos quadros";
}