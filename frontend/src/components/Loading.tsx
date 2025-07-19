export const Loading = () => {
  const loadingMessage = "Loading...";

  return (
    <div className="inline-block tracking-wide text-velvet-200">
      {loadingMessage.split("").map((l, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: Ignoring this as the message shape won't change.
          key={`${l}-${i}`}
          style={{ animationDelay: `${i * 100}ms` }}
          className="wobble"
        >
          {l}
        </span>
      ))}
    </div>
  );
};
