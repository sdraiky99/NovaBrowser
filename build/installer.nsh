; Nova 2.2.0 - instalador: textos, presentación animada y registro como navegador.
; Si la compilación falla por la presentación animada, añade la línea siguiente al principio de este archivo:
;   !define NOVA_NO_ANIM
; (el flujo de GitHub Actions lo hace solo si el primer intento falla).

!macro customHeader
  BrandingText "Nova Browser 2.2.0"
  !define MUI_WELCOMEPAGE_TITLE "Bienvenido a Nova"
  !define MUI_WELCOMEPAGE_TEXT "Nova 2.2: barra superior, Study, vista dividida, perfiles, zoom, seguridad, rendimiento y actualizaciones directas.$\r$\n$\r$\nEste asistente instalará Nova en tu equipo en menos de un minuto. No necesitas permisos de administrador y tus datos se conservan si ya tenías una versión anterior."
  !define MUI_DIRECTORYPAGE_TEXT_TOP "Elige la carpeta donde se instalará Nova. Se instala solo para tu usuario, por lo que no se piden permisos de administrador."
  !define MUI_FINISHPAGE_TITLE "Nova está listo"
  !define MUI_FINISHPAGE_TEXT "Nova 2.2.0 está instalada o actualizada correctamente.$\r$\n$\r$\nAl abrir Nova por primera vez verás un centro de bienvenida renovado, Nova Study y un recorrido rápido por las nuevas funciones. Para usarlo como navegador predeterminado, abre el menú y elige «Navegador predeterminado»."
  !define MUI_UNCONFIRMPAGE_TEXT_TOP "Nova se quitará de tu equipo. Tu historial, marcadores y ajustes se conservan por si decides volver a instalarlo."
!macroend

!ifndef NOVA_NO_ANIM
; Presentación con diapositivas que cambian solas (bienvenida animada). Sustituye la página de bienvenida estándar.
!macro customWelcomePage
  !include nsDialogs.nsh
  !include LogicLib.nsh
  Var NovaDlg
  Var NovaSlide
  Var NovaSlideBmp
  Var NovaSlideIdx

  Function NovaSlideTick
    IntOp $NovaSlideIdx $NovaSlideIdx + 1
    ${If} $NovaSlideIdx > 5
      StrCpy $NovaSlideIdx 1
    ${EndIf}
    ${NSD_SetStretchedImage} $NovaSlide "$PLUGINSDIR\nova-slide$NovaSlideIdx.bmp" $NovaSlideBmp
  FunctionEnd

  Function NovaWelcomeShow
    !insertmacro MUI_HEADER_TEXT "Bienvenido a Nova" "Nova 2.2: barra superior, Study, vista dividida, perfiles, zoom, seguridad, rendimiento y actualizaciones directas."
    InitPluginsDir
    File "/oname=$PLUGINSDIR\nova-slide1.bmp" "${BUILD_RESOURCES_DIR}\slide1.bmp"
    File "/oname=$PLUGINSDIR\nova-slide2.bmp" "${BUILD_RESOURCES_DIR}\slide2.bmp"
    File "/oname=$PLUGINSDIR\nova-slide3.bmp" "${BUILD_RESOURCES_DIR}\slide3.bmp"
    File "/oname=$PLUGINSDIR\nova-slide4.bmp" "${BUILD_RESOURCES_DIR}\slide4.bmp"
    File "/oname=$PLUGINSDIR\nova-slide5.bmp" "${BUILD_RESOURCES_DIR}\slide5.bmp"
    nsDialogs::Create 1018
    Pop $NovaDlg
    ${If} $NovaDlg == error
      Abort
    ${EndIf}
    StrCpy $NovaSlideIdx 1
    ${NSD_CreateBitmap} 0 0 100% 124u ""
    Pop $NovaSlide
    ${NSD_SetStretchedImage} $NovaSlide "$PLUGINSDIR\nova-slide1.bmp" $NovaSlideBmp
    ${NSD_CreateLabel} 0 130u 100% 20u "Pulsa Siguiente para elegir dónde instalar Nova. Nova puede instalarse o actualizarse sobre la instalación existente sin desinstalar Nova primero."
    Pop $0
    ${NSD_CreateTimer} NovaSlideTick 2600
    nsDialogs::Show
    ${NSD_KillTimer} NovaSlideTick
  FunctionEnd

  Page custom NovaWelcomeShow
!macroend
!endif

; Nova 2.2: el actualizador de la aplicación usa este mismo instalador NSIS para actualizar sobre la instalación existente.
; Registro de Nova como navegador disponible (aparece en Ajustes > Aplicaciones predeterminadas).
; Solo registra la capacidad: NO cambia tu navegador predeterminado; eso lo eliges tú en Windows.
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
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\Capabilities" "ApplicationName" "Nova"
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
