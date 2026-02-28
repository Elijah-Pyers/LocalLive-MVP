export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error" role="alert">
      <strong>Something went wrong.</strong>
      <div style={{ marginTop: "0.35rem" }}>{message}</div>
      {onRetry ? (
        <div style={{ marginTop: "0.75rem" }}>
          <button onClick={onRetry}>Try again</button>
        </div>
      ) : null}
    </div>
  );
}
