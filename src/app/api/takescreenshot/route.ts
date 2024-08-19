import { NextRequest, NextResponse } from 'next/server';

import puppeteer from "puppeteer";
import { join } from 'path';

export async function POST (req: NextRequest, res : NextResponse) {

    const { url } = await req.json();

	const filePath = join(process.cwd(), 'public', 'mdh569354@gmail.com_title_screenshot.png');

    try 
	{
		let browser = await puppeteer.launch({
			defaultViewport: {
				width: 1920,
				height: 1080
			},
			headless: true,
			timeout : 9000
		});

        let page = await browser.newPage();

        await page.goto(url, { waitUntil : 'networkidle0' });

		const screenshotBuffer = await page.screenshot({ path : filePath, optimizeForSpeed : true });
		const screenshotBase64 = Buffer.from(screenshotBuffer).toString('base64');


		await browser.close();

        return NextResponse.json({ screenshotBase64 : screenshotBase64, status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error : 'Internal Server Error', status: 500 });
    }
}