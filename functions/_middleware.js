const HANDLER_HASHES = "'sha256-bZ/1rWgJOJzyhd6wWEZPjvUKHgNXeoook6+8AFVil8s=' 'sha256-MzX0MFlhJelYMsgV8imJlEAn/1Um+hd6Deag4W3zCCQ=' 'sha256-uPDr4Do1tm2fU/zkf1GrBwsvhINvAMPyIagOA73YKvM=' 'sha256-ad2FNIorezR2SFWZ9NKCoYatZ7VXUaUoxswfLappzag=' 'sha256-0OpJ9RkXThhNneTeYBgUQGr8uTiD0Cn/1aqpR0bhLec=' 'sha256-HNz1hCy7o/d6BL1A0RZTi9gh+6pIA1gvKnK+VlWp1C8=' 'sha256-4rSMBDAZg8GA6MjyXpOE3QPOtuROkQyb2Dc1e+AlZ8w=' 'sha256-ml4IlbQNsnkVuzmpv7rma7PwlPINoQP50+IhcE/57uc=' 'sha256-jm3FkV4tNIdBUr8jRVVl5n9PUixlaxTWD0pdpFiSH5A=' 'sha256-qOzEGw8hvloqGEdsXvp1ljaV/aklFmb0lKRviB3wzoM=' 'sha256-qGthOFBZ9keCLUUjNoaCSbHJ8NWlY1DM8xRZ0yB39vo=' 'sha256-eVyg5m0h/FIB1KMWACoF3dc8dnlMWM9gP/JVRBKif9E=' 'sha256-6ONqH77KDeCttLICIFYO6FDTXRFBQdnAfNPdeuKtPe0=' 'sha256-i4z6BkiJAlNrXE5R02dVvk/koVr4j0Uj9m+LBTmmMOQ=' 'sha256-X9vVguFohwrnhSkdizPF4PrQgaPOblsF1TswUsb4y3M=' 'sha256-VazVPzwS2uARZVPR28VLSc82gZKbM8z2guCgA3oDL00=' 'sha256-hAQLKHy81zWZiqcVSxnPkUdW9z0FopU+bZLLkbRkHvQ=' 'sha256-NVaiHHBCvydYiAbx22PkUENI68Di+zq4Firi2md5r1I=' 'sha256-c7nfAqLXOHMDJna3R/lqzxdPtD40F9p0W1LeAZubTfc=' 'sha256-haUDFh7Y1jA3ShPDFHFbLMEAfES+UkdflKeQtGOQsmM=' 'sha256-tGVEnwT8/KKn/ImimRr8/pU5j/H2wQdb5QsYjL+NOsM=' 'sha256-rncc1hDXjYmNdKG2iagf7HdbO0hG/gD9fb0XpxYjL/Y=' 'sha256-/hlhymA+aJ9ujeWss3dZ1LXDCOsA2GdPcDXLzTOwXS8=' 'sha256-C4QN6oS9UB6T8Ik1JlXI0dUixv+0QLTBYXyII8pGZI4=' 'sha256-FxUKatYPGXA/5mqBgEERGnZTkD5CDedI98Ak+3vNlhA=' 'sha256-ChM/OVOQnhgXHONBjbjcCr6SlibTx7sFQNaNzVnqWpo=' 'sha256-hyyTamoaLuf4jZ8hYNqvWK8ShVGv00HU7WGgU/3aP2E=' 'sha256-w4ujnOpjBoH2vcasx+reJRUwYivG8Q3afx/XevGJod8=' 'sha256-KEpeUkzcr2xsv1g2gzv56uRL77VLKU74xdqaqe23l60=' 'sha256-Or709CGTCNMycYxyav6gW5VZOY2UZDzMsimxna/531M=' 'sha256-uYANvJMT47TtEWjacRrmUvCo6OhkDX7GroiUOACDYbk=' 'sha256-CsTY1A0nCohHUhJmcES2QhO5fliWd64SoweFuSlvxsM=' 'sha256-FZDgjZleBEe3KYebKuZCeRv+SuTQ7BzoCgk8wfaAWjs=' 'sha256-EQRtNC24phZ6yRw5QM+dyABtPWv5BOPkUlipOIqN2Zo=' 'sha256-IWSzkLw2tIZH1wmJkHOTwG7ZEIRxbzR+tDmJ9IK59Z0=' 'sha256-cvIr8SyuwfhCl90NfHFeQRru1HXFoBtNCcb56MGI8jk=' 'sha256-QKc7bkosfD66qoJZFKYh7FHcK5K6yiMRLRzNeWpJT5g=' 'sha256-IqPLx1ssQ+z9fFkKPMpqGAeN+jtBN25iv215/CiJbow=' 'sha256-VNUoWGd3/JX+GNWdK/k083TOVhAgUW/v2y+KTkivrMg=' 'sha256-LWLTbnN6Ww/oU1rkj2lz++OfbMzynB/18mGSCyf+GX8=' 'sha256-ARkKwVziDfM5ALOa/HPDFlWWPURK4xfNBIdzaW07/1Y=' 'sha256-mjV+QVUdBFETS21xnfFsZnOgmFdQRmwri0U3G8weYnE=' 'sha256-ERKknTZDgoEBK7vKy2MrjAa5MtFcvCbNwWENnjBgYLo=' 'sha256-iZCtYTGz6HFl5TcVyhH3VrZ39HofBbXmY9+CVyvqN44=' 'sha256-ekg/b21qzPObLpId1kX+6dGS7q31Vv2MJwTF0JqgKlY=' 'sha256-QhJa/oSdNPUI8BLqCD+dCg0EOg7B5q9RVI9ubztxPsE=' 'sha256-MwvNPb9dOzWApiryNpCDsqwWQXnSr0jIc/MIQfIZveQ=' 'sha256-ajlKEcCnuaYqPmoa77DjoXYKJQQSpo6Sa59rPPaS3Ro=' 'sha256-zCiUGKPMCQ2u/Ouk4pUdDmTtF5ij2nG4IcncU2ZSOoI=' 'sha256-2JJPs3xkPfQEvEm+wLw9xwuSOjwVIPafcZim+EYaCk8=' 'sha256-WqE3CeMa5s3IU7F9299Z+nXiivqAiXObXTWKnC5rw40=' 'sha256-i00PUsqj16KnyoFs7tix7aIxGAVQeQ6C6GU/zCb4J04=' 'sha256-5JKHCnifoV/VKUnDQJvqbokmmglK5FuA/bsyFXL4E9c=' 'sha256-aNOJVfWnfBSPkx1S3/U4unJqAuaaEEj6acMeoyAZWuM=' 'sha256-PA7kWXRHuNCMGvWY+a9xm5Hr2Co4rALp2uaMnrWkU+M=' 'sha256-TsO47FgIbeOHUoLmxqD0OiicTt/83nGkHL/S/SxZgpA=' 'sha256-gabZLfIciqymUxuvhwe3hheFKka2Y1Xwq1skeBLzn9M=' 'sha256-pzijPDc5nqjeUpYsZh9+tlg4r/yGvwaQ2uPjtJf0kHI=' 'sha256-eJdeAllZnVfNwXMdUNEUIiIwxI+ps7pl2qOkqpT22zQ=' 'sha256-QUIiEDJRRAN0/Qx2bFUJtAh6Os91G2yBVj5Lfz1sVc8=' 'sha256-jJPOnqdkFgUOHaoMzWsLufUuyoe67Npxu/AlMEi4THA=' 'sha256-KJhR4etvlxETwdzATQcb7va4aCdtalo0sxibDOfFAXs=' 'sha256-w1TScKw0oMUfsCaf0s2IDUPf968vto1Sd/ScSaCjxIg=' 'sha256-FFxGOajE7ueall6/rKjXco+0ckDTz8zsO4oDvQgNkws=' 'sha256-xLEKQoORsl0MQDMxnhD7hH2noSbUG5aznRRzS1n6IxU=' 'sha256-CBVOGgAFgjcMDpWzHOGyDpywSNnkQ26FqlSmlW3dwJY=' 'sha256-1Qwh1pS3zZuMQN1FsOHStsiloDWWy5WcWzYcBYxY7UU=' 'sha256-xKGhiE6QiZ1Jle44d/j0x43ZXQbylFsqYx27S4TAQKk=' 'sha256-FKITBCeNI3OvajPQZI/DkaUU5HHwQPBdIhb/slOXT3Q=' 'sha256-9YmpPxfWvIejs4Fwll1ICEHtglxc1MZtE6h32f6Hvd4=' 'sha256-DnvgjcERDWuxGGgpApueEllpZoTYocir5qjbb+Et+XI=' 'sha256-Bd9driQkLRmf5iqTQfJgXHE+TrP8Fu44EoDV/Bqgcwk=' 'sha256-V3JZnUAChv6OAzFG7O3ozyU9d5bvQksjU3sH3iJmP0E=' 'sha256-uPjmDmhf0uUCrjLorxEgFaM1fAF8dEG1cF/gTOm9uug=' 'sha256-HHt9W8XN25Qo9WOeucmqy/DGi4/fUBR8GCtOhGOPxPU=' 'sha256-pRRwtFkbA8f9YFuwF1f0OTtZxn75YOuDeFo6XBJnZto=' 'sha256-XZhMEekLrP6G1OR/4gle6jIWeqdnyb4fXm5KnuQPi/U=' 'sha256-9xsuIDMhUKDN+2v7rtrW2xqEubkttEwPdmMV4TGjLCM=' 'sha256-CcL34NiaFEQCKvMV7Sg0l1TXRX4T22v5lKhqYOPOvJ8=' 'sha256-OxX9hl69MJTw8bvD0ZaZSFFvD58EgFcfe4DZXb5CPwc=' 'sha256-BqPDeyoN20tCmLr3zTBlEiaf6lZuYvwc79rk4SnP6D8=' 'sha256-fKFYVpfL/18Aj+Dc+3Q2lDiNZfiPI02afIQoikoZIbQ=' 'sha256-nbL3i9K2C30ywjBDGyvfCqX7vcMO/VA7stDD/4KjIBw=' 'sha256-dxnAEBjxDzodfUayPW4z/yvNE866k3oDnFde2C7i5Fc=' 'sha256-oKLiGXR87i5eNX2N+EJdJXwQFeEUbsmcKlNCtWTzwHY=' 'sha256-dtl80F2DRMRaBCBc/P8g8CDXkN0LstdyrYjdOAk7iRM=' 'sha256-SN78tyjtTCmnTfjQ42yH94UoemN+SyN8coq1TPomlNk=' 'sha256-ICGx6jaMZGkGY6QivcdeOD7DTdT3za5mbshvQY0M+O8=' 'sha256-laT1mtbF9w8u/kmly5+YQx6bCJrR6CLMR5q4s8DmJtM=' 'sha256-uGod9aWOPy3S7O4q/TdT/ztzlP6xJ8/RrPd2VbNXCrI=' 'sha256-mD0ybaUhBDdxpcmZwTSMEcyb56duszVie12PYih3bOg=' 'sha256-uDLhupj4CSo9neUkIEl9OG0KPzularnrz/aANdwgn9s=' 'sha256-ama1He9+/uiSNyXpZia0wDWXGkEI+Or3NacBaRyxXUo=' 'sha256-skhnC/ZlR7299lxRLJlRT/IyGI4QlxpK9mj64BSrww4=' 'sha256-7ASjWsk2N6cCNuiGv7KbH/4lpsdd/wRDClLGBpZRp4s=' 'sha256-JY+yIu4DhxubfCuXY8QuN7zq79svTjfWIb+FZvzb3e8=' 'sha256-MCSR4o0B15108BxWEy7f0/zmLx//mvDtT05Y8Q7rs8M=' 'sha256-bLVpUyBKUPZYcPBTxktpK5clRHOFsunzbgx48cMc8Hc=' 'sha256-IOU9LXCaI8xVuZSB/7nhRGL0/V686/d8AII8VZuWPJA=' 'sha256-NHmg7iHXWNXlu2f8YgdhBoZBjbO+Jzqt4CBH5lP6ZdU=' 'sha256-EkQUSAhMj43qa3juvPJumHfRGZv7KwLxP9BBQBhonqo=' 'sha256-mgvf/lTO+r0SHEzaObOe8GPYMbhYyjCL7AvtvNThm6E=' 'sha256-cqf5d7A+o1UFf7lKeDgcXrJju9LF5QcXmRWl3VLMP3I=' 'sha256-pX7TKx1pJzxLVHbjZCqvvZT74f4FVZkGaHfG/nqRlak='";

function makeNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

class NonceInjector {
  constructor(nonce) {
    this.nonce = nonce;
  }
  element(el) {
    el.setAttribute('nonce', this.nonce);
  }
}

export async function onRequest(context) {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  const nonce = makeNonce();

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'unsafe-hashes' ${HANDLER_HASHES} https://challenges.cloudflare.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "media-src 'self'",
    "connect-src 'self'",
    "frame-src https://challenges.cloudflare.com",
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests"
  ].join('; ');

  const newHeaders = new Headers(response.headers);
  newHeaders.set('Content-Security-Policy', csp);

  if (!contentType.includes('text/html')) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }

  const passthrough = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });

  return new HTMLRewriter()
    .on('script', new NonceInjector(nonce))
    .transform(passthrough);
}
