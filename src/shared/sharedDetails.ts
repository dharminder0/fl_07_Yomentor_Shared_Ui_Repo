import AsyncStorage from "@react-native-async-storage/async-storage";
export const userData = () => {
  const userData: any = [
    {
      name: "Teacher",
      phone: "11111",
      password: "11111",
      role: "Teacher",
    },
    {
      name: "Student",
      phone: "22222",
      password: "22222",
      role: "Student",
    },
    {
      name: "Parent",
      phone: "33333",
      password: "33333",
      role: "Parent",
    },
  ];
  return userData;
};

export const saveAsyncData = async (key: string, data: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    console.log("User data saved successfully.");
  } catch (error) {
    console.error("Error saving user data: ", error);
  }
};

let userInfo: any = {};
export const getUserData = async (key: string) => {
  try {
    const result: any = await AsyncStorage.getItem(key);
    const currentUser = JSON.parse(result);
    if (key === "userData") userInfo = currentUser;
    return currentUser;
  } catch (error) {
    console.error("Error retrieving user data: ", error);
    return null;
  }
};

export const getUserInfo = () => {
  return userInfo;
};

export const clearUserData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log("User data cleared successfully.");
  } catch (error) {
    console.error("Error clearing user data: ", error);
  }
};

export const getOngoingBatchData = () => {
  const ongoingBatch: any = [
    {
      id: 1,
      batchName: "Class 3 Mathematics",
      teacherid: 1,
      classid: 3,
      className: "IV",
      subjectid: 7,
      subjectName: "Mathematics",
      status: 1,
      days: "M/W/F",
      createdate: "2024-03-06 12:14:52.950",
      updatedate: "2024-03-06 12:14:52.950",
      startdate: "2024-04-01",
      tuitionTime: "15:00:00",
      fee: 300,
      feeType: "Week",
      studentCount: 5,
      isdeleted: 0,
      description:
        "Applied mathematics. Theoretical mechanics. Complex variables. No matter what math discipline is your passion, we have advanced classes and seminars that address it.",
    },
    {
      id: 2,
      batchName: "Class 3 English",
      teacherid: 1,
      classid: 3,
      className: "II",
      subjectid: 8,
      subjectName: "English",
      status: 1,
      days: ["T", "TH", "SA"],
      createDate: "2024-03-06 12:15:46.103",
      updateDate: "2024-03-06 12:15:46.103",
      startDate: "2024-04-01",
      tuitionTime: "16:00:00",
      fee: 499,
      feeType: "Month",
      studentCount: 5,
      isdeleted: 0,
      description:
        "Everyday English focuses on: listening, speaking, as well as grammar correction, vocabulary and pronunciation. It aims to improve students skills in the areas of speaking and listening in order to communicate more effectively using English in both formal and informal settings",
    },
  ];
  return ongoingBatch;
};
export const getOpenBatchData = () => {
  const openBatch: any = [
    {
      id: 1,
      name: "Class 3 Mathematics",
      teacherid: 1,
      classid: 3,
      className: "Class 3",
      subjectid: 7,
      subjectName: "Mathematics",
      status: 1,
      days: ["T", "Th"],
      createDate: "2024-03-06 12:14:52.950",
      updateDate: "2024-03-06 12:14:52.950",
      startDate: "2024-04-01",
      tuitionTime: "15:00:00",
      fee: 300,
      feeType: "Week",
      studentCount: "5/10",
      isdeleted: 0,
    },
    {
      id: 2,
      name: "Class 3 English",
      teacherid: 1,
      classid: 3,
      className: "Class 3",
      subjectid: 2,
      subjectName: "English",
      status: 1,
      days: ["T", "Th", "S"],
      createDate: "2024-03-06 12:14:52.950",
      updateDate: "2024-03-06 12:14:52.950",
      startDate: "2024-04-01",
      tuitionTime: "15:00:00",
      fee: 399,
      feeType: "Month",
      studentCount: "9/10",
      isdeleted: 0,
    },
  ];
  return openBatch;
};

export const getStudentData = () => {
  const studentData: any = [
    {
      id: 1,
      name: "Dhruv Gupta",
      address: "123 Main Road Indirapuram",
      phone: "1234567890",
      className: "Class 3",
      batchDetails: ["Mathematics"],
    },
    {
      id: 2,
      name: "Gayas Khan",
      address: "456 Saya Gold Apartment Delhi",
      phone: "9876543210",
      className: "Class 3",
      batchDetails: ["Mathematics"],
    },
    {
      id: 3,
      name: "Kiran Sharma",
      address: "456 Graphix Tower Sector 62 Delhi",
      phone: "9876543213",
      className: "Class 3",
      batchDetails: ["Mathematics"],
    },
  ];
  return studentData;
};

export const getFeeTypes = () => {
  const feeTypes: any = [
    {
      id: 0,
      name: "Hour",
    },
    {
      id: 1,
      name: "Day",
    },
    {
      id: 2,
      name: "Week",
    },
    {
      id: 3,
      name: "Month",
    },
  ];
  return feeTypes;
};

export const getDayList = () => {
  const days: any = [
    {
      id: 0,
      name: "Sunday",
    },
    {
      id: 1,
      name: "Monday",
    },
    {
      id: 2,
      name: "Tuesday",
    },
    {
      id: 3,
      name: "Wednesday",
    },
    {
      id: 4,
      name: "Thursday",
    },
    {
      id: 5,
      name: "Friday",
    },
    {
      id: 6,
      name: "Saturday",
    },
  ];
  return days;
};

export function getTypes() {
  const type: any = {
    //   File Extension   MIME Type
    abs: "audio/x-mpeg",
    ai: "application/postscript",
    aif: "audio/x-aiff",
    aifc: "audio/x-aiff",
    aiff: "audio/x-aiff",
    aim: "application/x-aim",
    art: "image/x-jg",
    asf: "video/x-ms-asf",
    asx: "video/x-ms-asf",
    au: "audio/basic",
    avi: "video/x-msvideo",
    avx: "video/x-rad-screenplay",
    bcpio: "application/x-bcpio",
    bin: "application/octet-stream",
    bmp: "image/bmp",
    body: "text/html",
    cdf: "application/x-cdf",
    cer: "application/pkix-cert",
    class: "application/java",
    cpio: "application/x-cpio",
    csh: "application/x-csh",
    css: "text/css",
    dib: "image/bmp",
    doc: "application/msword",
    dtd: "application/xml-dtd",
    dv: "video/x-dv",
    dvi: "application/x-dvi",
    eot: "application/vnd.ms-fontobject",
    eps: "application/postscript",
    etx: "text/x-setext",
    exe: "application/octet-stream",
    gif: "image/gif",
    gtar: "application/x-gtar",
    gz: "application/x-gzip",
    hdf: "application/x-hdf",
    hqx: "application/mac-binhex40",
    htc: "text/x-component",
    htm: "text/html",
    html: "text/html",
    ief: "image/ief",
    jad: "text/vnd.sun.j2me.app-descriptor",
    jar: "application/java-archive",
    java: "text/x-java-source",
    jnlp: "application/x-java-jnlp-file",
    jpe: "image/jpeg",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    js: "application/javascript",
    jsf: "text/plain",
    json: "application/json",
    jspf: "text/plain",
    kar: "audio/midi",
    latex: "application/x-latex",
    m3u: "audio/x-mpegurl",
    mac: "image/x-macpaint",
    man: "text/troff",
    mathml: "application/mathml+xml",
    me: "text/troff",
    mid: "audio/midi",
    midi: "audio/midi",
    mif: "application/x-mif",
    mov: "video/quicktime",
    movie: "video/x-sgi-movie",
    mp1: "audio/mpeg",
    mp2: "audio/mpeg",
    mp3: "audio/mpeg",
    mp4: "video/mp4",
    mpa: "audio/mpeg",
    mpe: "video/mpeg",
    mpeg: "video/mpeg",
    mpega: "audio/x-mpeg",
    mpg: "video/mpeg",
    mpv2: "video/mpeg2",
    ms: "application/x-wais-source",
    nc: "application/x-netcdf",
    oda: "application/oda",
    odb: "application/vnd.oasis.opendocument.database",
    odc: "application/vnd.oasis.opendocument.chart",
    odf: "application/vnd.oasis.opendocument.formula",
    odg: "application/vnd.oasis.opendocument.graphics",
    odi: "application/vnd.oasis.opendocument.image",
    odm: "application/vnd.oasis.opendocument.text-master",
    odp: "application/vnd.oasis.opendocument.presentation",
    ods: "application/vnd.oasis.opendocument.spreadsheet",
    odt: "application/vnd.oasis.opendocument.text",
    otg: "application/vnd.oasis.opendocument.graphics-template",
    oth: "application/vnd.oasis.opendocument.text-web",
    otp: "application/vnd.oasis.opendocument.presentation-template",
    ots: "application/vnd.oasis.opendocument.spreadsheet-template",
    ott: "application/vnd.oasis.opendocument.text-template",
    ogx: "application/ogg",
    ogv: "video/ogg",
    oga: "audio/ogg",
    ogg: "audio/ogg",
    otf: "application/x-font-opentype",
    spx: "audio/ogg",
    flac: "audio/flac",
    anx: "application/annodex",
    axa: "audio/annodex",
    axv: "video/annodex",
    xspf: "application/xspf+xml",
    pbm: "image/x-portable-bitmap",
    pct: "image/pict",
    pdf: "application/pdf",
    pgm: "image/x-portable-graymap",
    pic: "image/pict",
    pict: "image/pict",
    pls: "audio/x-scpls",
    png: "image/png",
    pnm: "image/x-portable-anymap",
    pnt: "image/x-macpaint",
    ppm: "image/x-portable-pixmap",
    ppt: "application/vnd.ms-powerpoint",
    pps: "application/vnd.ms-powerpoint",
    ps: "application/postscript",
    psd: "image/vnd.adobe.photoshop",
    qt: "video/quicktime",
    qti: "image/x-quicktime",
    qtif: "image/x-quicktime",
    ras: "image/x-cmu-raster",
    rdf: "application/rdf+xml",
    rgb: "image/x-rgb",
    rm: "application/vnd.rn-realmedia",
    roff: "text/troff",
    rtf: "application/rtf",
    rtx: "text/richtext",
    sfnt: "application/font-sfnt",
    sh: "application/x-sh",
    shar: "application/x-shar",
    sit: "application/x-stuffit",
    snd: "audio/basic",
    src: "application/x-wais-source",
    sv4cpio: "application/x-sv4cpio",
    sv4crc: "application/x-sv4crc",
    svg: "image/svg+xml",
    svgz: "image/svg+xml",
    swf: "application/x-shockwave-flash",
    t: "text/troff",
    tar: "application/x-tar",
    tcl: "application/x-tcl",
    tex: "application/x-tex",
    texi: "application/x-texinfo",
    texinfo: "application/x-texinfo",
    tif: "image/tiff",
    tiff: "image/tiff",
    tr: "text/troff",
    tsv: "text/tab-separated-values",
    ttf: "application/x-font-ttf",
    txt: "text/plain",
    ulw: "audio/basic",
    ustar: "application/x-ustar",
    vxml: "application/voicexml+xml",
    xbm: "image/x-xbitmap",
    xht: "application/xhtml+xml",
    xhtml: "application/xhtml+xml",
    xls: "application/vnd.ms-excel",
    xml: "application/xml",
    xpm: "image/x-xpixmap",
    xsl: "application/xml",
    xslt: "application/xslt+xml",
    xul: "application/vnd.mozilla.xul+xml",
    xwd: "image/x-xwindowdump",
    vsd: "application/vnd.visio",
    wav: "audio/x-wav",
    wbmp: "image/vnd.wap.wbmp",
    wml: "text/vnd.wap.wml",
    wmlc: "application/vnd.wap.wmlc",
    wmls: "text/vnd.wap.wmlsc",
    wmlscriptc: "application/vnd.wap.wmlscriptc",
    wmv: "video/x-ms-wmv",
    woff: "application/font-woff",
    woff2: "application/font-woff2",
    wrl: "model/vrml",
    wspolicy: "application/wspolicy+xml",
    z: "application/x-compress",
    zip: "application/zip",
  };
  return type;
}
