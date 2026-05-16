// @ts-nocheck
import { useSearchParams } from "react-router-dom";
export default function useQuery(props = {}) {
  let query = props;
  const [searchParams] = useSearchParams();
  for (const key of searchParams.keys()) {
    query[key] = searchParams.get(key);
  }
  return [query];
}
