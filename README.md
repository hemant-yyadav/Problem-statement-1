# College Event Certificate Eligibility Board

A small React + TypeScript app for evaluating whether college-event participants qualify for certificates.

## Eligibility

Participants must complete activities in **LEARN**, **BUILD**, and **SHARE**, and earn at least **6 points**.

The app validates participant data, shows ineligibility reasons, and lists eligible participants first.

## Run locally

```bash
npm install
npm run dev
```

## Useful commands

```bash
npm test     # run tests
npm run build # type-check and create a production build
```

Activity definitions are fixed in `src/data/activities.ts`.
