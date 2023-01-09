
// Logical operators
and = function(f1, f2) {
  return ((f1 + f2) == 2) ? 1 : 0;
}

or = function(f1, f2) {
  return ((f1 + f2) >= 1) ? 1 : 0;
}

xor = function(f1, f2) {
  return ((f1 + f2) == 1) ? 1 : 0;
}

// Returns in reverse order!
get_single_digits = function(txt) {
  out = [];
  for (let i = txt.length - 1; i >= 0; i--) {
    out.push(parseInt(txt[i]));
  }
  if (out.length == 0) {
    out = [0];
  }
  return out;
}

make_equal_length = function(arr, reference) {
  while(reference.length - arr.length > 0) {
    arr.push(0);
  }
  return arr;
}

reverse = function(arr) {
  let out = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    out.push(arr[i]);
  }
  return out;
}

perform_addition = function() {
	
  a = get_single_digits(document.getElementById("fig1").value);
  b = get_single_digits(document.getElementById("fig2").value);
  a = make_equal_length(a, b);
  b = make_equal_length(b, a);
  
  // res = result
  // ovf = overflow
  // tmp = temporary result (before combined with previous overflow.
  res0 = xor(a[0], b[0]);
  ovf0 = and(a[0], b[0]);
  
  tmp = [res0];
  res = [res0];
  ovf = [ovf0];
  
  for (let i = 1; i < a.length; i++) {
    tmp[i] = xor(  a[i],   b[i]);
    res[i] = xor(tmp[i], ovf[i-1]);
    ovf[i] =  or(and(  a[i],     b[i]),
                 and(ovf[i-1], tmp[i]));
  }
  
  // The final result is the uppermost overflow added to the result.
  res = reverse(res);
  tmp = reverse(tmp);
  ovf = reverse(ovf);
  
  if (ovf[0] == 1) {
    ovf_and_res = ovf[0] + res.join("");
  } else {
    ovf_and_res = res.join("");
  }
  
  // From here on, it is just formatting for the user.
  a = make_equal_length(a, ovf_and_res);
  b = make_equal_length(b, ovf_and_res);
  var aTxt = reverse(a).join("");
  var bTxt = reverse(b).join("");
  
  var tmpTxt = tmp.join("");
  var ovfTxt = ovf.join("");
  if (ovf_and_res.length > tmpTxt.length) {
    tmpTxt = "0" + tmpTxt;
    ovfTxt = ovfTxt + "x";
  } else if (ovfTxt.length > 1) {
    ovfTxt = ovfTxt.substring(1) + "x";
  }
  
  document.getElementById("res").value = 
  ovf_and_res + " = result (overflow included)\n" +
  ovfTxt + " = overflow (from digits to the right)\n" +
  tmpTxt + " = temporary result (a[...] + b[...]) \n" +
  "---------------\n" +
  aTxt + " = A\n" +
  bTxt + " = B\n";
}


perform_subtraction = function() {

  if (document.getElementById("fig1s").value == "" && document.getElementById("fig2s").value == "") {
    return null;
  }

  a = get_single_digits(document.getElementById("fig1s").value);
  b = get_single_digits(document.getElementById("fig2s").value);
  a = make_equal_length(a, b);
  b = make_equal_length(b, a);
  len = a.length;

  // This bit says if this or lower bits are not empty.
  // Thaht's needed to determine if the overflow should be used or if the
  // result from the overflow should be put into the negative sign.
  nEm = Array.apply(null, Array(len));
  nEm[len - 1] = or(a[len - 1], b[len - 1]);
  if (len > 1) {
    for (let i = len - 2; i >= 0; i--) {
      nEm[i] = or(nEm[i + 1], or(a[i], b[i]));
    }
  }

  res0 = xor(a[0], b[0]);
  ovf0 = and(
    xor(a[0], 1),  // a is 0
    xor(b[0], 0)); // and b is 1

  res = [res0];
  ovf = [ovf0];

  for (let i = 1; i < len; i++) {
    // Result
    res[i] = and(
      nEm[i], // Digit is not empty
      xor( // ...and xor(a, b | overflow)
        a[i],
        or(b[i], ovf[i - 1]))
      )
    // Overflow
    // DEVIATION FROM CIRCUIT. The overflow is not according to the circuit, i.e. the circuit is erroneous.
    // Added the embracing or(...) and the line 'xor(and(b[i], ovf[i - 1]), 0)' in it.
    // According to the circuit, it would only be the and(...) statement.
    ovf[i] = or(
      xor(and(b[i], ovf[i - 1]), 0), // b AND prev overflow are 1.
      and(
        xor(a[i], 1), // a is 0
        xor(or(b[i], ovf[i - 1]), 0))  // and b or previous overflow is 1
      );
  }

  // The sign
  // The last sign will be handled specially because there is no "not empty" bit.
  sig = Array.apply(null, Array(len));
  for (let i = 0; i < len - 1; i++) {
    sig[i] = and(
      xor(nEm[i], 1), //  Current digits is empty
      xor(ovf[i], 0)); // and overflow (from previous) is 1.
  }
  sig[len - 1] = ovf[len - 1]; // In the last digits, overflow equals sign.

  // If any sign was given, then apply it to the result.
  sign = 0;
  for (let i = 0; i < len; i++) {
    sign = or(sign, sig[i]);
  }
  sign = sig[len - 1] == 1 ? "-" : "";

  resTxt = sign + reverse(res).join("");
  ovfTxt = reverse(ovf).join("");
  sigTxt = reverse(sig).join("");
  aTxt = reverse(a).join("");
  bTxt = reverse(b).join("");
  if (sign == "-") {
    ovfTxt = " " + ovfTxt;
    sigTxt = " " + sigTxt;
    aTxt = " " + aTxt;
    bTxt = " " + bTxt;
  }

  document.getElementById("ress").value = 
  resTxt + " = result \n" +
  sigTxt + " = negative sign indication\n" +
  ovfTxt + " = overflow\n" +
  "---------------\n" +
  aTxt + " = A\n" +
  bTxt + " = B\n";
}