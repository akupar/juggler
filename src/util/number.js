export function chomp(num) {
    let num_s = num.toString();
    if ( num_s.length >= 17 ) {
        num_s = num_s.substring(0, 15);
    }

    //console.log("num_s:", num_s, num_s.length);
    return parseInt(num_s, 10);
}

function getRepeatedPattern(ending) {
    console.log("****");
    let pattern = ending[0];
    let j = 0;
    for ( let i = 1; i < ending.length; i++ ) {
        console.log("  ", ending[i], "~", pattern[j]);
        if ( ending[i] !== pattern[j] ) {
            pattern = ending.substring(0, i+1);
            console.log("  -->", pattern);
        }
        j = (i + 1) % pattern.length;
    }

    return pattern;
}

export function suppressRepeatingDigits(number) {
    let _, head, tail;
    try {
        [_, head, tail] = number.toString().match(/^([0-9]+)\.([0-9]+)$/);
    } catch ( TypeError ) {
        return number + "...";
    }

    console.log("_:", _);

    const repeating = getRepeatedPattern(tail);
    if ( repeating.length <= tail.length / 3 ) {
        return head + "." + repeating + repeating + repeating + "...";
    }
    return head + "." + tail + "...";
}

