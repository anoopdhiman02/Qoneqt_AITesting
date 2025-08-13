import { createClient } from "@supabase/supabase-js";

const PROD_URL = "https://qoneqt.com/api/";
const PROD_IMAGE_URL = "https://cdn.qoneqt.com/";

const DEV_URL = "https://qoneqt.xyz/api/";
const DEV_IMAGE_URL = "https://cdn.qoneqt.xyz/";

const TEST_URL = "https://ownsound.xyz/api/";
const LOCAL_URL = "http://192.168.0.144:3000/api/";

const DEV_GO_URL = "https://qoneqt.xyz/v1/api/";
const PROD_GO_URL = "https://qoneqt.com/v1/api/";

export const URL_PATH = "app-api.php";

const isProd = true;

// XYZ
const R2_ACCESS_XYZ_KEY = "973a4d2162c55ca1c7f9e0be47b45fb7"
const R2_SECRET_XYZ_KEY = "e8ec6bb085372766cd6e9951c0941178a00f8d02b2abfc2d43ec6deeb8c56157"
const R2_BUCKET_XYZ = "qoneqttest"
const R2_ENDPOINT_XYZ = "https://ca5014936df81743ed3cbafd370d6b79.r2.cloudflarestorage.com"
const R2_PUBLIC_URL_XYZ = "https://cdn.qoneqt.xyz/"

// COM
const R2_ACCESS_COM_KEY = "a954e7638b4ba4d96437db3b19384f55"
const R2_SECRET_COM_KEY = "3d034a3450201d2f66a977e494655c410ca6be0781414b0623aee0fb0ac00633"
const R2_BUCKET_COM = "qoneqtmainr2"
const R2_ENDPOINT_COM = "https://ca5014936df81743ed3cbafd370d6b79.r2.cloudflarestorage.com"
const R2_PUBLIC_URL_COM = "https://cdn.qoneqt.com/"

export const BASE_URL = PROD_URL;
export const BASE_GO_URL = PROD_GO_URL;
export const R2_PUBLIC_URL = PROD_IMAGE_URL;
export const R2_ACCESS_KEY = R2_ACCESS_COM_KEY;
export const R2_SECRET_KEY = R2_SECRET_COM_KEY;
export const R2_BUCKET = R2_BUCKET_COM;
export const R2_ENDPOINT = R2_ENDPOINT_COM;
export const R2_PUBLICS_URL = R2_PUBLIC_URL_COM;

// export const BASE_URL = DEV_URL;
// export const BASE_GO_URL = DEV_GO_URL;
// export const R2_PUBLIC_URL = DEV_IMAGE_URL;
// export const R2_ACCESS_KEY = R2_ACCESS_XYZ_KEY;
// export const R2_SECRET_KEY = R2_SECRET_XYZ_KEY;
// export const R2_BUCKET = R2_BUCKET_XYZ;
// export const R2_ENDPOINT = R2_ENDPOINT_XYZ;
// export const R2_PUBLICS_URL = R2_PUBLIC_URL_XYZ;

export const SUPABASE_URL = "https://rbmtdkhfovbjvaryupov.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXRka2hmb3ZianZhcnl1cG92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2NDAwMTY3NCwiZXhwIjoxOTc5NTc3Njc0fQ._6LuzYDJEBtx0gs5ftUdhYP_smVrgw0kZAJyfIC6UHs";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
