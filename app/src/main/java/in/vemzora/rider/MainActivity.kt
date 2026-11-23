package in.vemzora.rider

import android.Manifest
import android.app.Activity
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.WebResourceRequest
import android.widget.Toast
import android.view.View
import android.view.WindowManager

class MainActivity : Activity() {
    private lateinit var web: WebView
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.setFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON, WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), 7001)
        }
        web = WebView(this)
        web.settings.javaScriptEnabled = true
        web.settings.domStorageEnabled = true
        web.settings.loadsImagesAutomatically = true
        web.settings.javaScriptCanOpenWindowsAutomatically = true
        web.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                return !request.url.host.orEmpty().endsWith("vemzora.in")
            }
        }
        web.webChromeClient = WebChromeClient()
        web.overScrollMode = View.OVER_SCROLL_NEVER
        setContentView(web)
        if (savedInstanceState == null) web.loadUrl(BuildConfig.RIDER_URL) else web.restoreState(savedInstanceState)
    }
    override fun onSaveInstanceState(outState: Bundle) { super.onSaveInstanceState(outState); web.saveState(outState) }
    @Deprecated("Deprecated in Java")
    override fun onBackPressed() { if (this::web.isInitialized && web.canGoBack()) web.goBack() else super.onBackPressed() }
}
