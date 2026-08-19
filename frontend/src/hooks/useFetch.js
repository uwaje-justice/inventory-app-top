import { useReducer, useEffect, useCallback } from "react";

const initialState = { data: null, loading: true, error: "" };

function fetchReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { data: action.payload, loading: false, error: "" };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useFetch(fetcher, deps = []) {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  const load = useCallback(() => {
    let cancelled = false;
    dispatch({ type: "FETCH_START" });
    fetcher()
      .then((data) => {
        if (!cancelled) dispatch({ type: "FETCH_SUCCESS", payload: data });
      })
      .catch((err) => {
        if (!cancelled) {
          const message = err?.response?.data?.message || "Something went wrong.";
          dispatch({ type: "FETCH_ERROR", payload: message });
        }
      });
    return () => { cancelled = true; };
  }, deps);

  useEffect(() => {
    const cleanup = load();
    return cleanup;
  }, [load]);

  return { ...state, refetch: load };
}
