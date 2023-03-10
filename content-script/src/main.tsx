import React, { createElement } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import Sentiment from "sentiment";
const sentiment = new Sentiment();
import SentimentPill from "./SentimentPill";

const ranges: any[] = [];

const reddit_selector = "._1qeIAgB0cPwnLhDF9XSiJM";
const reddit_2 = "._3cjCphgls6DH-irkVaA0GM ._1qeIAgB0cPwnLhDF9XSiJM";
const twitter_selector = ".r-bnwqim.r-qvutc0 .r-qvutc0";
const selectors = [reddit_selector, twitter_selector, reddit_2];

let neut_lower = -0.1;
let neut_upper = 0.1;

function handleClick(id: string) {
  let element: HTMLElement | undefined = map.get(id);
  if (element) {
    const displayValue = element!.style.display;
    element!.style.display = displayValue === "none" ? "block" : "none";
  }
}

let map: Map<string, HTMLElement> = new Map();

let id = 1;

async function init() {
  neut_lower = await chrome.storage.sync
    .get(["neut_lower_bound"])
    .then((result) => {
      return parseFloat(result.neut_lower_bound);
    });
  neut_upper = await chrome.storage.sync
    .get(["neut_upper_bound"])
    .then((result) => {
      return parseFloat(result.neut_upper_bound);
    });

  if (neut_lower == undefined || neut_lower == null) {
    neut_lower = -0.1;
  }

  if (neut_upper == undefined || neut_lower == null) {
    neut_upper = 0.1;
  }

  ranges.push(
    {
      min: -5,
      max: neut_lower,
      message: "Negative 😕, Show?",
      class:
        "!inline-block !whitespace-nowrap !rounded-full !bg-rose-500 !px-[0.65em] !pt-[0.35em] !pb-[0.25em] !text-center !align-baseline !text-[0.75em] !font-bold !leading-none !text-danger-700",
    },
    {
      min: neut_lower,
      max: neut_upper,
      message: "Neutral 😐",
      class:
        "!inline-block !whitespace-nowrap !rounded-full !bg-yellow-500 !px-[0.65em] !pt-[0.35em] !pb-[0.25em] !text-center !align-baseline !text-[0.75em] !font-bold !leading-none !text-black",
    },
    {
      min: neut_upper,
      max: 5,
      message: "Positive 🙂",
      class:
        "inline-block whitespace-nowrap rounded-full bg-green-600 px-[0.65em] pt-[0.35em] pb-[0.25em] text-center align-baseline text-[0.75em] font-bold leading-none text-success-700",
    }
  );
}

function evaluate(element: HTMLElement) {
  let text = element.innerHTML;
  let analysis = sentiment.analyze(text);

  console.log({ text: text, anal: analysis });

  if (analysis.tokens.length < 3) {
    return;
  }

  let score = analysis.comparative;

  const range = ranges.find(
    (range) => range.min <= score && score <= range.max
  );

  element.style.display = score >= neut_lower ? "block" : "none";
  const message = range ? range.message : "The number is outside the range";

  // search for id sentiment

  const container = document.createElement("div");
  container.id = `sentiment-${id}`;

  element.parentElement?.insertAdjacentElement("afterend", container);

  createRoot(container).render(
    <React.StrictMode>
      <SentimentPill
        id={`sentiment-${id}`}
        message={message}
        class={range?.class}
        onClick={handleClick}
      />
    </React.StrictMode>
  );

  map.set(`sentiment-${id}`, element);
  id++;
}

function observeDOM(mutationsList: any[]) {
  for (let node of mutationsList) {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    node.querySelectorAll("[id^='sentiment-']").forEach((e) => {
      e.remove();
    });

    selectors.forEach((selector) => {
      Array.from(node.querySelectorAll(selector)).forEach((element) => {
        if (element instanceof HTMLElement) {
          // if (selector == draft_selector) {
          //   element.addEventListener("input", (event) => {
          //     console.log(element);
          //     evaluate(element);
          //     return;
          //   });
          // }
          evaluate(element);
        }
      });
    });
  }
}

init().then(() => {
  // Define the mutation observer
  const observer = new MutationObserver((mutations) => {
    const mutationRecords = [...mutations];
    const childListMutations = mutationRecords.filter(
      (mutation) => mutation.type === "childList"
    );
    const addedNodes = childListMutations.flatMap((mutation) => [
      ...mutation.addedNodes,
    ]);

    observeDOM(addedNodes);
  });

  // Start observing the DOM
  observer.observe(document.getRootNode(), { childList: true, subtree: true });
});
