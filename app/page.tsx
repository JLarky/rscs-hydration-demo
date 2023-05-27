/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { revalidatePath } from "next/cache";

let counter = 0;
export default function Page() {
  async function cnslog() {
    "use server";
    console.log(
      "so now the app will behave differently depending if it got hydrated?"
    );
  }
  async function reload() {
    "use server";
    revalidatePath("/");
  }

  const requestId = Math.random();

  return (
    <div>
      request n: {requestId} {++counter}
      <br />
      <br />
      <button>Console.log in the browser</button>
      <br />
      <br />
      <form action={cnslog}>
        <button type="submit">Console.log on the server</button>
      </form>
      <br />
      <form action={reload}>
        <button type="submit">RSC reload</button>
      </form>
      <br />
      <form>
        <button type="submit">browser reload</button>
      </form>
      <script
        dangerouslySetInnerHTML={{
          __html: `
const log = (msg) => {
  console.log(msg);
}
// because we set the event handler before we block the browser it would just collect events
document.querySelector("button").addEventListener("click", () => {
  log("button clicked in the browser")
});
// blocking wait
const wait = (ms) => {
  const startTime = new Date();
  while (true) {
    const currentTime = new Date();
    if (currentTime.getTime() - startTime.getTime() >= ms) {
      break
    }
  }
}
log("torture begins")
// block everything for 2 seconds
setTimeout(() => {
  log("all your base are belong to us")
  wait(2000)
  log("unblock browser")
}, 0);
// unblock browser but block the hydration
setTimeout(() => {
  log("no hydration to you")
  wait(5000)
  log("you can start hydrating now")
}, 10);

`,
        }}
      />
    </div>
  );
}
