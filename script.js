
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
