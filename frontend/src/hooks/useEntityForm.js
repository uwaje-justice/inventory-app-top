import { useReducer, useEffect, useCallback } from "react";

const initialState = {
  values: {},
  errors: {},
  apiError: "",
  loading: false,
  submitting: false,
};

function formReducer(state, action) {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, loading: true, apiError: "" };
    case "LOAD_SUCCESS":
      return { ...state, values: action.payload, loading: false };
    case "LOAD_ERROR":
      return { ...state, loading: false, apiError: action.payload };
    case "SET_FIELD":
      return {
        ...state,
        values: { ...state.values, [action.name]: action.value },
        errors: (() => {
          if (!state.errors[action.name]) return state.errors;
          const next = { ...state.errors };
          delete next[action.name];
          return next;
        })(),
        apiError: "",
      };
    case "SET_ERRORS":
      return { ...state, errors: action.payload };
    case "SUBMIT_START":
      return { ...state, submitting: true, apiError: "" };
    case "SUBMIT_SUCCESS":
      return { ...state, submitting: false };
    case "SUBMIT_ERROR":
      return { ...state, submitting: false, apiError: action.payload };
    default:
      return state;
  }
}

export function useEntityForm({ defaultValues, fetcher, createFn, updateFn, id, isEdit }) {
  const [state, dispatch] = useReducer(formReducer, {
    ...initialState,
    values: defaultValues,
    loading: isEdit,
  });

  useEffect(() => {
    if (!isEdit || !fetcher) return;
    let cancelled = false;
    fetcher(id)
      .then((data) => {
        if (!cancelled) dispatch({ type: "LOAD_SUCCESS", payload: data });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "LOAD_ERROR", payload: "Failed to load data." });
      });
    return () => { cancelled = true; };
  }, [id, isEdit, fetcher]);

  const setField = useCallback((name, value) => {
    dispatch({ type: "SET_FIELD", name, value });
  }, []);

  const handleSubmit = useCallback(
    async (validate, navigate) => {
      dispatch({ type: "SET_ERRORS", payload: {} });
      const errs = validate(state.values);
      if (Object.keys(errs).length > 0) {
        dispatch({ type: "SET_ERRORS", payload: errs });
        return false;
      }

      dispatch({ type: "SUBMIT_START" });
      try {
        if (isEdit && updateFn) {
          await updateFn(id, state.values);
        } else if (createFn) {
          await createFn(state.values);
        }
        dispatch({ type: "SUBMIT_SUCCESS" });
        navigate();
        return true;
      } catch (err) {
        const message = err?.response?.data?.message || "Something went wrong.";
        dispatch({ type: "SUBMIT_ERROR", payload: message });
        return false;
      }
    },
    [state.values, isEdit, id, createFn, updateFn],
  );

  return {
    ...state,
    setField,
    handleSubmit,
  };
}
