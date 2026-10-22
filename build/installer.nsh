; Close any running Nova instance before replacing application files.
; User data is stored separately and is not removed by this process.
!macro customInit
  nsExec::ExecToLog '"$SYSDIR\taskkill.exe" /F /T /IM Nova.exe'
  Pop $0
  Sleep 1200
!macroend

; Nova 6.0.1 — Nova Chrome Hybrid visual refresh and custom toolbar wallpaper
; Conserva los datos del usuario durante la instalación, actualización y desinstalación.
!macro customHeader
  BrandingText "Nova Browser 6.0.1"
  !define MUI_WELCOMEPAGE_TITLE "Bienvenido a Nova 6.0.1"
  !define MUI_WELCOMEPAGE_TEXT "Nova Chrome Hybrid 6.0.1 · interfaz renovada, navegación coherente y herramientas propias de Nova.\r$\n\r$\nPuedes instalar o actualizar Nova sin desinstalar la versión anterior. Tus favoritos, historial, Workspaces, ajustes y datos personales se conservan."
  !define MUI_DIRECTORYPAGE_TEXT_TOP "Elige la carpeta de instalación. Para actualizar Nova normalmente no necesitas cambiarla."
  !define MUI_FINISHPAGE_TITLE "Nova 6.0.1 está listo"
  !define MUI_FINISHPAGE_TEXT "Nova 6.0.1 se ha instalado o actualizado correctamente. Los datos de usuario se conservan."
  !define MUI_UNCONFIRMPAGE_TEXT_TOP "Nova se quitará del equipo. Los datos personales de usuario no se eliminan automáticamente."
!macroend
!macro customInstall
  WriteRegStr HKCU "Software\Classes\NovaURL" "" "Nova URL"
  WriteRegStr HKCU "Software\Classes\NovaURL" "URL Protocol" ""
  WriteRegStr HKCU "Software\Classes\NovaURL\DefaultIcon" "" '$INSTDIR\${APP_EXECUTABLE_FILENAME},0'
  WriteRegStr HKCU "Software\Classes\NovaURL\shell\open\command" "" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" "%1"'
  WriteRegStr HKCU "Software\Classes\NovaHTML" "" "Nova HTML Document"
  WriteRegStr HKCU "Software\Classes\NovaHTML\DefaultIcon" "" '$INSTDIR\${APP_EXECUTABLE_FILENAME},0'
  WriteRegStr HKCU "Software\Classes\NovaHTML\shell\open\command" "" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" "%1"'
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova" "" "Nova"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\DefaultIcon" "" '$INSTDIR\${APP_EXECUTABLE_FILENAME},0'
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\shell\open\command" "" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}"'
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\Capabilities" "ApplicationName" "Nova 6.0.1"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\Capabilities" "ApplicationIcon" '$INSTDIR\${APP_EXECUTABLE_FILENAME},0'
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\Capabilities" "ApplicationDescription" "Navegador web moderno basado en Chromium"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\Capabilities\URLAssociations" "http" "NovaURL"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\Capabilities\URLAssociations" "https" "NovaURL"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\Capabilities\FileAssociations" ".html" "NovaHTML"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\Capabilities\FileAssociations" ".htm" "NovaHTML"
  WriteRegStr HKCU "Software\RegisteredApplications" "Nova" "Software\Clients\StartMenuInternet\Nova\Capabilities"
!macroend
!macro customUnInstall
  DeleteRegKey HKCU "Software\Classes\NovaURL"
  DeleteRegKey HKCU "Software\Classes\NovaHTML"
  DeleteRegKey HKCU "Software\Clients\StartMenuInternet\Nova"
  DeleteRegValue HKCU "Software\RegisteredApplications" "Nova"
!macroend
