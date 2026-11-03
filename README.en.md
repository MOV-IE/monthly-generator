# Monthly Generator

[한국어](README.md) · **English**

A browser tool for making printable monthly diary inserts and full-page calendars, then saving them as PDF. Nothing to install.

**Open it:** https://mov-ie.github.io/monthly-generator/

The interface is in Korean. Korean labels are shown in brackets below so you can find them on the page.

## What it does

- **Two-page inserts (속지 2면):** one month across two facing pages. The left page has a month column and 3 days, the right page has 4 days. Default size is 86×171mm.
- **Yearly page at the front (맨 앞에 연간 달력):** adds a one-page 12-month calendar before January. In two-sided layout it goes on the front of the first leaf (the cover spot). Month names (January / Jan / jan / 1), weight and scale are adjustable.
- **Big calendar (큰 달력):** one month per sheet with all 7 days in a row. Landscape or portrait, A4 or A3.
- **Dated or undated (날짜형 / 만년형):** with year and dates printed, or blank to fill in by hand.
- **Red days (빨간날):** Sundays and Korean public holidays, including substitute holidays, updated automatically every month. You can add your own dates too.
- **Style:** month label (1 / 01 / jan / 1 jan.), first day of the week, font, text sizes, italics, line colour and weight, text colour.
- **Print layout:** save at insert size, or lay several pages onto A4 or A3 with crop marks, one-sided or two-sided.

## Automatic holiday updates

Red days come from the **KASI special-day API** (한국천문연구원 특일 정보) on the Korean public data portal.

- On the 1st of every month, a GitHub Actions job fetches holidays from last year to two years ahead and saves them to `holidays.json`. Substitute holidays, temporary holidays and election days are included.
- The site reads `holidays.json` each time it opens, so newly announced holidays show up without any code change.
- If you download the page and open it as a local file, it can't read `holidays.json` and uses the data built into the page (2025–2030).

**One-time setup**
1. Apply for "한국천문연구원_특일 정보" on [data.go.kr](https://www.data.go.kr) and get an API key.
2. In this repository, go to **Settings → Secrets and variables → Actions → New repository secret**. Name it `HOLIDAY_API_KEY` and paste the key. Either the encoded or decoded key works.
3. Run **Actions → Update holidays → Run workflow** once to update right away.

## How to use

1. Open the page.
2. In the left panel, choose the **format (형태)**: two-page inserts (속지 2면) or big calendar (큰 달력).
3. Set the year (연도), start month (시작 월) and end month (끝 월), then adjust the month label, font, colours and margins. The preview on the right updates as you go.
4. For inserts, choose the **paper (출력 용지)**:
   - **Insert size (속지 크기):** saves each page at its real size, such as 86×171mm. Use this for a print shop or paper already cut to size.
   - **A4 / A3:** lays several pages on each sheet. With orientation on **auto (자동)** it picks whichever direction fits the most pages. 86×171mm fits 3 pages on landscape A4.
5. Press **Save as PDF / Print (PDF로 저장 / 인쇄)** at the bottom, then choose **Save as PDF** in the print dialog.

Your settings are saved in the browser and come back next time. **Reset (처음 설정으로 되돌리기)** restores the defaults.

### Fonts

The default font is Futura. If Futura is installed (it comes with every Mac), you'll see Futura. Otherwise the page falls back to Jost, a similar free font. To use another font, choose **Font → custom (직접 입력)** and type the name of a font installed on your computer.

## Printing tips

**Print dialog settings**
- Set scale to **100% (actual size)**. "Fit to page" will shrink your inserts.
- Set margins to **none**.
- Turn **headers and footers** off so the date and URL don't print.
- Turn **background graphics** on to keep the red-day colour.
- If the paper size doesn't come out as the insert size or A4, try **Chrome**. It handles page sizes most accurately.

**Two-sided printing (ring binder inserts)**
- In **two-sided (양면)** layout, each leaf has this month's right page on the front and next month's left page on the back. Cut them and put them in order, and each month opens across a spread.
- The front of the first leaf is blank and can be a cover. With **yearly page at the front** turned on, the yearly calendar goes there, and its back is January's left page.
- Print portrait layouts with **flip on long edge** and landscape layouts with **flip on short edge**. The panel shows which one to use.

**First print**
- Print one sheet first and measure it with a ruler.
- For two-sided, hold it up to the light to check the front and back line up. Some printers are off by 1–2mm.
- Adjust room for ring holes with the **inner margin (안쪽 여백)**. The default is 6mm.

**Cutting and paper**
- With crop marks (재단선) on, cut lines are marked just outside each page corner. A craft knife and a ruler give clean edges.
- Most printers can't print the outer 3–5mm of the sheet. Put that value in **printer safe margin (프린터 안전 여백)** so nothing gets cut off.
- Fitting two A5 pages on one A4 sheet needs a safe margin of 0. Only do this if your printer can print borderless. Otherwise choose A3, or print straight onto A5 paper.
- For fountain pens, paper of 100gsm or more shows less through the back.
