<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns="http://www.w3.org/2000/svg" 
	xmlns:xlink="http://www.w3.org/1999/xlink" 
	xmlns:ev="http://www.w3.org/2001/xml-events" 
	xmlns:snp="http://www-dssz.informatik.tu-cottbus.de/" version="1.0">
	
	<xsl:output doctype-system="http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" doctype-public="-//W3C//DTD SVG 1.1//EN" indent="yes" standalone="no" cdata-section-elements="script text"/>
	
	<xsl:param name="title">No title</xsl:param>
	
	<xsl:template match="Snoopy">
		<xsl:processing-instruction name="xml-stylesheet">href="/xsl/css/snoopy.css" type="text/css"</xsl:processing-instruction>
		<svg xmlns="http://www.w3.org/2000/svg" 
			xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events" 
			xmlns:snp="http://www-dssz.informatik.tu-cottbus.de/" version="1.1" width="100%" height="100%" zoomAndPan="disable">
			<title>Patty v1.2 - Extended PT Net <xsl:value-of select="@name"/></title>
			<defs>
				<symbol id="sliderSymbol" overflow="visible">
					<line x1="0" y1="-10" x2="0" y2="10" stroke="dimgray" stroke-width="5" pointer-events="none"/>
				</symbol>
				<!-- hand symbol for panning -->
				<symbol id="symbPan" overflow="visible">
					<path transform="scale(1.2)" fill="none" stroke="dimgray" stroke-width="1" d="M-2 6 C -2.2 2.5 -8.0 -0 -5.7 -1.9 C -4.3 -2.5 -3.3 -0.5 -2.5 0.7 C -3.2 -2.1 -5.5 -5.2 -3.6 -5.8 C -2.1 -6.3 -1.6 -3.6 -1.1 -1.9 C -0.9 -4.2 -1.6 -6.4 -0.2 -6.6 C 1.4 -6.8 0.9 -3 1.1 -1.9 C 1.5 -3.5 1.2 -6.1 2.5 -6.1 C 3.9 -6.1 3.5 -3.2 3.6 -1.6 C 4 -2.9 4.1 -4.3 5.3 -4.4 C 7.3 -3.5 4 2.2 3 6z"/>
				</symbol>
				<!-- symbols for radio buttons -->
				<symbol id="radioBorder" overflow="visible">
					<circle fill="white" stroke="dimgray" stroke-width="1.5" r="5"/>
				</symbol>
				<symbol id="radioPoint" overflow="visible">
					<circle fill="dimgray" r="3" pointer-events="none"/>
				</symbol>
				<linearGradient id="titleBarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="40%" style="stop-color:rgb(128,128,128);stop-opacity:1"/>
					<stop offset="60%" style="stop-color:rgb(50,50,50);stop-opacity:1"/>
				</linearGradient>

			    <symbol id="playIcon" overflow="visible" fill="dimgray">
			      <path d="M -3,-5 L 3,0 L -3,5 z"/>
			    </symbol>
			    <symbol id="playStepIcon" overflow="visible" fill="dimgray">
			      <path d="M-3,-5 L3,0 L3,-5 L5,-5 L5,5 L3,5 L3,0 L-3,5 z"/>
			    </symbol>
				<symbol id="stopIcon" overflow="visible" fill="dimgray">
      				<path d="M -5,-5 L 5,-5 L 5,5 L -5,5 z"/>
				</symbol>
				<symbol id="pauseIcon" overflow="visible" fill="dimgray">
					<path d="M 0,0 L 4,0 L 4,10 L 0,10 z M 6,0 L 10,0 L 10,10 L 6,10 z"/>
				</symbol>
				
				<symbol id="magnifyerZoomIn" overflow="visible" fill="none" stroke="dimgray" stroke-width="2">
					<line x1="-4" y1="0" x2="4" y2="0"/>
					<line x1="0" y1="-4" x2="0" y2="4"/>
				</symbol>
				<symbol id="magnifyerZoomOut" overflow="visible">
					<line x1="-4" y1="0" x2="4" y2="0" fill="none" stroke="dimgray" stroke-width="2" />
				</symbol>
				<symbol id="wrench" overflow="visible">
					<polygon points="20,10 90,80 80,90 10,20 20,10" transform="scale(.15) translate(-50 -50)"
						   style="fill:dimgray" />
					<circle cx="15" cy="15" r="20" fill="dimgray" transform="scale(.15) translate(-50 -50)" />
					<circle cx="85" cy="85" r="20" fill="dimgray" transform="scale(.15) translate(-50 -50)" />
					<circle cx="10" cy="10" r="15" fill="white" transform="scale(.15) translate(-50 -50)" />
					<circle cx="90" cy="90" r="15" fill="white" transform="scale(.15) translate(-50 -50)" />
				</symbol>
				<pattern id="muster" patternUnits="userSpaceOnUse" width="10" height="10" x="0" y="0">
					<line x1="5" y1="0" x2="5" y2="10" stroke="lightgray" />
					<line x1="0" y1="5" x2="10" y2="5" stroke="lightgray" />
				</pattern>
				
				<script type="text/javascript" xlink:href="/xsl/js/mootools-1.2-Core.js"/>
				<script type="text/javascript" xlink:href="/xsl/js/mootools-1.2-Drag.js"/>
				<script type="text/javascript" xlink:href="/xsl/js/helper_functions.js"/>
				<script type="text/javascript" xlink:href="/xsl/js/timer.js"/>
				<script type="text/javascript" xlink:href="/xsl/js/mapApp.js"/>
				<script type="text/javascript" xlink:href="/xsl/js/Window.js"/>
				<script type="text/javascript" xlink:href="/xsl/js/button.js"/>
				<script type="text/javascript" xlink:href="/xsl/js/slider.js"/>
				<script type="text/javascript" xlink:href="/xsl/js/checkbox_and_radiobutton.js"/>
				<script type="text/javascript" xlink:href="/xsl/js/combobox.js"/>
				<script type="text/javascript" xlink:href="/xsl/js/textbox.js"/>
				<script type="text/javascript" xlink:href="/xsl/js/animator.js"/>
				<script type="text/javascript" xlink:href="/xsl/js/errorsearch.js"/>
				<script type="text/javascript" xlink:href="sequences.seq"/>
				<script type="text/javascript" xlink:href="/xsl/js/snoopy_spept.js"/>
		<!-- Pfeilspitzen-->				
				<marker id="Triangle000" viewBox="0 0 10 10" refX="10" refY="5" markerUnits="strokeWidth" markerWidth="7" markerHeight="5" orient="auto">
					<path d="M 0 0 L 10 5 L 0 10 z" fill="rgb(0,0,0)" stroke="none"/>
				</marker>
				<marker id="Triangle00255" viewBox="0 0 10 10" refX="10" refY="5" markerUnits="strokeWidth" markerWidth="7" markerHeight="5" orient="auto" fill="blue">
					<path d="M 0 0 L 10 5 L 0 10 z" fill="rgb(0,0,255)" stroke="none"/>
				</marker>
		<!-- Lesekante -->
				<marker id="lesekante000" refY="5" refX="9" viewBox="0 0 20 20" markerUnits="strokeWidth" markerWidth="15" markerHeight="12" orient="auto">
					<circle cy="5" cx="5" r="4"/>
				</marker>
				<marker id="lesekante00255" refY="5" refX="9" viewBox="0 0 20 20" markerUnits="strokeWidth" markerWidth="15" markerHeight="12" orient="auto" fill="blue">
					<circle cy="5" cx="5" r="4"/>
				</marker>
		<!-- Verbotskante -->
				<marker id="verbotskante000" refY="5" refX="9" viewBox="0 0 20 20" markerUnits="strokeWidth" markerWidth="15" markerHeight="12" orient="auto">
					<circle r="4" cx="5" cy="5" fill="white" stroke="black" stroke-width="1" />
				</marker>
				<marker id="verbotskante00255" refY="5" refX="9" viewBox="0 0 20 20" markerUnits="strokeWidth" markerWidth="15" markerHeight="12" orient="auto" fill="blue">
					<circle r="4" cx="5" cy="5" fill="white" stroke="black" stroke-width="1" />
				</marker>
		<!-- Equalark -->		
				<marker id="equalark000" viewBox="0 0 20 18" refX="19" refY="5" markerUnits="strokeWidth" markerWidth="15" markerHeight="12" orient="auto">
					<circle r="4" cx="5" cy="5" />
					<circle r="4" cx="15" cy="5" />
				</marker>
				<marker id="equalark00255" viewBox="0 0 20 18" refX="19" refY="5" markerUnits="strokeWidth" markerWidth="15" markerHeight="12" orient="auto" fill="blue">
					<circle r="4" cx="5" cy="5" />
					<circle r="4" cx="15" cy="5" />
				</marker>
		<!-- Abraeumkante -->
				<marker id="abraeumkante000" viewBox="0 0 17 17" refX="13" refY="5" markerUnits="strokeWidth" markerWidth="20" markerHeight="18" orient="auto">
					<!-- Achtung_ relative Pfadangaben -->
					<!-- FF2 ua kann keine relativen Pfade lesen
						<path d="M 1 3 l 5 2 l -5 2 z
							 m 4 2 m 3 0
							 l 0 -2 l 5 2 l -5 2 l 0 -2" />-->
							 <path d="M 1 3 L 6 5 L 1 7 z M 8 5 L 8 3 L 13 5 L 8 7 z"/>
				</marker>
				<marker id="abraeumkante00255" viewBox="0 0 17 17" refX="13" refY="5" markerUnits="strokeWidth" markerWidth="20" markerHeight="18" orient="auto" fill="blue">
					<!-- Achtung_ relative Pfadangaben -->
					<!-- FF2 ua kann keine relativen Pfade lesen
						<path d="M 1 3 l 5 2 l -5 2 z
							 m 4 2 m 3 0
							 l 0 -2 l 5 2 l -5 2 l 0 -2" />-->
					<path d="M 1 3 L 6 5 L 1 7 z M 8 5 L 8 3 L 13 5 L 8 7 z"/>
				</marker>
			</defs>
			
			<g id="main">
				<g id="net" snp:scale="1" snp:translate="0,0">
					<xsl:apply-templates/>
				</g>
			</g>
		</svg>
	</xsl:template>
	
	<xsl:template match="nodeclass[@name='Place']/node | nodeclass[@name='Coarse Place']/node">
		<xsl:variable name="marking">
			<xsl:if test="not(attribute[@name='Marking'])">
				<xsl:value-of select="0"/>
			</xsl:if>
			<xsl:if test="attribute[@name='Marking']">
				<xsl:value-of select="normalize-space(attribute[@name='Marking'])"/>
			</xsl:if>
		</xsl:variable>
		<xsl:variable name="name" select="../@name"/>
		<g class="{$name}" id="{@id}" snp:marking="{$marking}" snp:net="{@net}">
			<xsl:if test="./../@name='Coarse Place'">
				<xsl:attribute name="class">CoarsePlace</xsl:attribute>
				<xsl:attribute name="snp:coarse">
					<xsl:value-of select="@coarse"/>
				</xsl:attribute>
			</xsl:if>
			<xsl:for-each select="graphics/graphic[@show=1]">
				<xsl:variable name="stroke">
					<xsl:if test="@pen and not(@net &gt; ../../@net)">
						<xsl:value-of select="@pen"/>
					</xsl:if>
					<xsl:if test="not(@pen) and not(@net &gt; ../../@net)">
						<xsl:text>0,0,0</xsl:text>
					</xsl:if>
					<xsl:if test="@net &gt; ../../@net">
						<xsl:text>0,0,255</xsl:text>
					</xsl:if>
				</xsl:variable>
				<xsl:variable name="fill">
					<xsl:if test="@brush">
						<xsl:text>rgb(</xsl:text><xsl:value-of select="@brush"/><xsl:text>)</xsl:text>
					</xsl:if>
					<xsl:if test="not(@brush) and not(../../attribute[@name='Logic']=1)">
						<xsl:text>rgb(255,255,255)</xsl:text>
					</xsl:if>
					<xsl:if test="../../attribute[@name='Logic']=1 and not(@brush)">
						<xsl:text>rgb(200,200,200)</xsl:text>
					</xsl:if>
				</xsl:variable>
				<xsl:variable name="radius">
					<xsl:if test="@w"><xsl:value-of select="@w div 2"/></xsl:if>
					<xsl:if test="not(@w)">10</xsl:if>
				</xsl:variable>
				<circle class="{$name}" id="{@id}" cx="{@x}" cy="{@y}" r="{$radius}" fill="{$fill}" stroke="rgb({$stroke})" snp:net="{@net}">
					<xsl:if test="./../../../@name='Coarse Place'">
						<xsl:attribute name="class">CoarsePlace</xsl:attribute>
					</xsl:if>
				</circle>
				<xsl:if test="./../../../@name='Coarse Place'">
					<circle class="CoarsePlace" cx="{@x}" cy="{@y}" r="{number($radius)-(number($radius) div 2)}" fill="{$fill}" stroke="rgb({$stroke})" snp:net="{@net}"/>
				</xsl:if>
			</xsl:for-each>
			<xsl:apply-templates select="attribute[@name='Name']"/>
		</g>
	</xsl:template>
	<xsl:template match="nodeclass[@name='Transition']/node | nodeclass[@name='Coarse Transition']/node">
		<xsl:variable name="name" select="../@name"/>
		<g id="{@id}" class="{$name}" snp:firing="0" snp:net="{@net}">
			<xsl:if test="./../@name='Coarse Transition'">
				<xsl:attribute name="class">CoarseTransition</xsl:attribute>
				<xsl:attribute name="snp:coarse">
					<xsl:value-of select="@coarse"/>
				</xsl:attribute>
			</xsl:if>
			<xsl:for-each select="graphics/graphic[@show=1]">
				<xsl:variable name="stroke">
					<xsl:if test="@pen and not(@net &gt; ../../@net) and not(../../../@name='Coarse Transition')">
						<xsl:value-of select="@pen"/>
					</xsl:if>
					<xsl:if test="not(@pen) and not(@net &gt; ../../@net) and not(../../../@name='Coarse Transition')">
						<xsl:text>0,0,0</xsl:text>
					</xsl:if>
					<xsl:if test="../../../@name='Coarse Transition'">
						<xsl:text>0,0,0</xsl:text>
					</xsl:if>
					<xsl:if test="@net &gt; ../../@net and not(../../../@name='Coarse Transition')">
						<xsl:text>0,0,255</xsl:text>
					</xsl:if>
				</xsl:variable>
				<xsl:variable name="fill">
					<xsl:if test="@brush">
						<xsl:value-of select="@brush"/>
					</xsl:if>
					<xsl:if test="not(@brush)">
						<xsl:text>255,255,255</xsl:text>
					</xsl:if>
				</xsl:variable>
				<xsl:variable name="width">
					<xsl:if test="@w">
						<xsl:value-of select="@w"/>
					</xsl:if>
					<xsl:if test="not(@w)">
						<xsl:value-of select="20"/>
					</xsl:if>
				</xsl:variable>
				<xsl:variable name="height">
					<xsl:if test="@h">
						<xsl:value-of select="@h"/>
					</xsl:if>
					<xsl:if test="not(@h)">
						<xsl:value-of select="20"/>
					</xsl:if>
				</xsl:variable>
				<rect class="{$name}" id="{@id}" x="{@x - ($width div 2)}" y="{@y - ($height div 2)}" width="{$width}" height="{$height}" fill="rgb({$fill})" stroke="rgb({$stroke})" snp:net="{@net}"/>
				<xsl:if test="../../../@name='Coarse Transition'">
					<rect class="{$name}" x="{@x - ($width div 2) + ($width div 4)}" y="{@y - ($height div 2) + ($height div 4)}" width="{$width div 2}" height="{$height div 2}" fill="none" stroke="rgb(0,0,0)" stroke-width="1px" snp:net="{@net}"/>
				</xsl:if>
			</xsl:for-each>
			<xsl:apply-templates select="attribute[@name='Name']"/>
		</g>
	</xsl:template>
	
	<xsl:template match="nodeclass[@name='Comment']/node">
		<g id="{@id}" class="{../@name}" snp:net="{@net}">
			<xsl:for-each select="graphics/graphic[@show=1]">
				<text x="{@x}" y="{@y}" style="font-family:monospace; font-size:10px;">
					<xsl:value-of select="../../attribute[@name='Comment']"/>
				</text>
			</xsl:for-each>
		</g>
	</xsl:template>
	
	<xsl:template match="attribute[@name='Name']">
		<xsl:for-each select="graphics/graphic[@show=1]">
			<xsl:variable name="x">
				<xsl:if test="not(@x) and @xoff">
					<xsl:value-of select="number(@xoff)+number(../../../graphics/graphic/@x)"/>
				</xsl:if>
				<xsl:if test="@x">
					<xsl:value-of select="number(@x) - ((string-length(normalize-space(../../.)) * 6.5) div 2)"/>
				</xsl:if>
			</xsl:variable>
			<xsl:variable name="y">
				<xsl:if test="not(@y) and @yoff">
					<xsl:value-of select="number(@yoff)+number(../../../graphics/graphic/@y)"/>
				</xsl:if>
				<xsl:if test="@y">
					<xsl:value-of select="number(@y)"/>
				</xsl:if>
			</xsl:variable>
			<text class="{../../@name}" x="{$x}" y="{$y}" style="font-family:monospace; font-size:10px;" snp:net="{@net}">
				<xsl:value-of select="normalize-space(../../.)"/>
			</text>
		</xsl:for-each>
	</xsl:template>
<!-- Template für die Kommentare -->	
	<xsl:template match="attribute[@name='Comment']">
		<text class="Comment" x="{graphics/graphic/@x}" y="{graphics/graphic/@y}" style="font-family:monospace; font-size:10px;">
			<xsl:value-of select="." disable-output-escaping="no"/>
		</text>
	</xsl:template>
	
<!-- Normal Edge -->
	<xsl:template match="edgeclasses/edgeclass[@name='Edge']/edge">
		<xsl:variable name="multiplicity" select="normalize-space(attribute[@name='Multiplicity'])"/>
		<xsl:variable name="class" select="../@name"/>
		
		<g id="{@id}" class="{$class}" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}" snp:multiplicity="{$multiplicity}">
			<xsl:if test="$multiplicity&gt;1">
				<xsl:for-each select="attribute[@name='Multiplicity']/graphics/graphic[@show=1]">
					<xsl:variable name="xoff">
						<xsl:if test="@xoff">
							<xsl:value-of select="@xoff"/>
						</xsl:if>
						<xsl:if test="not(@xoff)">
							<xsl:value-of select="0"/>
						</xsl:if>
					</xsl:variable>
					<xsl:variable name="yoff">
						<xsl:if test="@yoff">
							<xsl:value-of select="@yoff"/>
						</xsl:if>
						<xsl:if test="not(@yoff)">
							<xsl:value-of select="0"/>
						</xsl:if>
					</xsl:variable>
					<text class="{$class}" x="{@x}" y="{@y}" style="font-family:monospace; font-size:10px;" snp:net="{@net}">
						<xsl:value-of select="$multiplicity"/>
					</text>
				</xsl:for-each>
			</xsl:if>
			<xsl:for-each select="graphics/graphic[@show=1]">
				<xsl:variable name="list_of_points">
					<xsl:for-each select="points/point">
						<xsl:value-of select="@x"/>
						<xsl:text>,</xsl:text>
						<xsl:value-of select="@y"/>
						<xsl:if test="position() != last()">
							<xsl:text> </xsl:text>
						</xsl:if>
					</xsl:for-each>
				</xsl:variable>
				<xsl:if test="@pen and not(@net &gt; ../../@net)">
					<defs>				
						<marker id="Triangle_{@id}" viewBox="0 0 10 10" refX="10" refY="5" markerUnits="strokeWidth" markerWidth="7" markerHeight="5" orient="auto" fill="rgb({@brush})" stroke="rgb({@pen})" stroke-width=".4">
							<path d="M 0 0 L 10 5 L 0 10 z"/>
						</marker>
					</defs>
					<polyline class="Edge" id="Edge_{@id}" fill="none" stroke="rgb({@pen})" stroke-width="1.5px" points="{$list_of_points}" marker-end="url(#Triangle_{@id})" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}"/>
				</xsl:if>
				<xsl:if test="not(@pen) and not(@net &gt; ../../@net)">
					<polyline class="Edge" id="Edge_{@id}" fill="none" stroke="black" stroke-width="1.5px" points="{$list_of_points}" marker-end="url(#Triangle000)" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}"/>
				</xsl:if>
				<xsl:if test="not(@pen) and (@net &gt; ../../@net)">
					<polyline class="Edge" id="Edge_{@id}" fill="none" stroke="blue" stroke-width="1.5px" points="{$list_of_points}" marker-end="url(#Triangle00255)" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}"/>
				</xsl:if>
			</xsl:for-each>
		</g>
	</xsl:template>
	
<!-- NEU: Lesekante (Read Edge)-->
	<xsl:template match="edgeclasses/edgeclass[@name='Read Edge']/edge">
		<xsl:variable name="multiplicity" select="normalize-space(attribute[@name='Multiplicity'])"/>
		<xsl:variable name="class" select="../@name"/>
		
		<g id="{@id}" class="{$class}" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}" snp:multiplicity="{$multiplicity}">
			<xsl:if test="$multiplicity&gt;1">
				<xsl:for-each select="attribute[@name='Multiplicity']/graphics/graphic[@show=1]">
					<xsl:variable name="xoff">
						<xsl:if test="@xoff">
							<xsl:value-of select="@xoff"/>
						</xsl:if>
						<xsl:if test="not(@xoff)">
							<xsl:value-of select="0"/>
						</xsl:if>
					</xsl:variable>
					<xsl:variable name="yoff">
						<xsl:if test="@yoff">
							<xsl:value-of select="@yoff"/>
						</xsl:if>
						<xsl:if test="not(@yoff)">
							<xsl:value-of select="0"/>
						</xsl:if>
					</xsl:variable>
					<text class="{$class}" x="{@x}" y="{@y}" style="font-family:verdana; font-size:11px;" snp:net="{@net}">
						<xsl:value-of select="$multiplicity"/>
					</text>
				</xsl:for-each>
			</xsl:if>
			<xsl:for-each select="graphics/graphic[@show=1]">
				<xsl:variable name="list_of_points">
					<xsl:for-each select="points/point">
						<xsl:value-of select="@x"/>
						<xsl:text>,</xsl:text>
						<xsl:value-of select="@y"/>
						<xsl:if test="position() != last()">
							<xsl:text> </xsl:text>
						</xsl:if>
					</xsl:for-each>
				</xsl:variable>
				<xsl:if test="@pen and not(@net &gt; ../../@net)">
					<defs>
						<marker id="lesekante_{@id}" refY="5" refX="9" viewBox="0 0 20 20" markerUnits="strokeWidth" markerWidth="15" markerHeight="12" orient="auto" fill="rgb({@brush})" stroke="rgb({@pen})" stroke-width=".4">
							<circle cy="5" cx="5" r="4"/>
						</marker>
					</defs>
					<polyline class="Edge" id="Edge_{@id}" fill="none" stroke="rgb({@pen})" stroke-width="1.5px" points="{$list_of_points}" marker-end="url(#lesekante_{@id})" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}"/>
				</xsl:if>
				<xsl:if test="not(@pen) and not(@net &gt; ../../@net)">
					<polyline class="Edge" id="Edge_{@id}" fill="none" stroke="black" stroke-width="1.5px" points="{$list_of_points}" marker-end="url(#lesekante000)" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}"/>
				</xsl:if>
				<xsl:if test="not(@pen) and (@net &gt; ../../@net)">
					<polyline class="Edge" id="Edge_{@id}" fill="none" stroke="blue" stroke-width="1.5px" points="{$list_of_points}" marker-end="url(#lesekante00255)" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}"/>
				</xsl:if>
			</xsl:for-each>
		</g>
	</xsl:template>
	
<!-- NEU: Verbotskante (Inhibitor Edge)-->
	<xsl:template match="edgeclasses/edgeclass[@name='Inhibitor Edge']/edge">
		<xsl:variable name="multiplicity" select="normalize-space(attribute[@name='Multiplicity'])"/>
		<xsl:variable name="class" select="../@name"/>
		
		<g id="{@id}" class="{$class}" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}" snp:multiplicity="{$multiplicity}">
			<xsl:if test="$multiplicity&gt;1">
				<xsl:for-each select="attribute[@name='Multiplicity']/graphics/graphic[@show=1]">
					<xsl:variable name="xoff">
						<xsl:if test="@xoff">
							<xsl:value-of select="@xoff"/>
						</xsl:if>
						<xsl:if test="not(@xoff)">
							<xsl:value-of select="0"/>
						</xsl:if>
					</xsl:variable>
					<xsl:variable name="yoff">
						<xsl:if test="@yoff">
							<xsl:value-of select="@yoff"/>
						</xsl:if>
						<xsl:if test="not(@yoff)">
							<xsl:value-of select="0"/>
						</xsl:if>
					</xsl:variable>
					<text class="{$class}" x="{@x}" y="{@y}" style="font-family:verdana; font-size:11px;" snp:net="{@net}">
						<xsl:value-of select="$multiplicity"/>
					</text>
				</xsl:for-each>
			</xsl:if>
			<xsl:for-each select="graphics/graphic[@show=1]">
				<xsl:variable name="list_of_points">
					<xsl:for-each select="points/point">
						<xsl:value-of select="@x"/>
						<xsl:text>,</xsl:text>
						<xsl:value-of select="@y"/>
						<xsl:if test="position() != last()">
							<xsl:text> </xsl:text>
						</xsl:if>
					</xsl:for-each>
				</xsl:variable>
				<xsl:if test="@pen and not(@net &gt; ../../@net)">
					<defs>
						<marker id="verbotskante_{@id}" refY="5" refX="9" viewBox="0 0 20 20" markerUnits="strokeWidth" markerWidth="15" markerHeight="12" orient="auto" fill="rgb({@brush})" stroke="rgb({@pen})" stroke-width=".4">
							<circle r="4" cx="5" cy="5" />
						</marker>
					</defs>
					<polyline class="Edge" id="Edge_{@id}" fill="none" stroke="rgb({@pen})" stroke-width="1.5px" points="{$list_of_points}" marker-end="url(#verbotskante_{@id})" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}"/>
				</xsl:if>
				<xsl:if test="not(@pen) and not(@net &gt; ../../@net)">
					<polyline class="Edge" id="Edge_{@id}" fill="none" stroke="black" stroke-width="1.5px" points="{$list_of_points}" marker-end="url(#verbotskante000)" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}"/>
				</xsl:if>
				<xsl:if test="not(@pen) and (@net &gt; ../../@net)">
					<polyline class="Edge" id="Edge_{@id}" fill="none" stroke="blue" stroke-width="1.5px" points="{$list_of_points}" marker-end="url(#verbotskante00255)" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}"/>
				</xsl:if>
			</xsl:for-each>
		</g>
	</xsl:template>
	
<!-- NEU: Equalark (Equal Edge)-->
	<xsl:template match="edgeclasses/edgeclass[@name='Equal Edge']/edge">
		<xsl:variable name="multiplicity" select="normalize-space(attribute[@name='Multiplicity'])"/>
		<xsl:variable name="class" select="../@name"/>
		
		<g id="{@id}" class="{$class}" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}" snp:multiplicity="{$multiplicity}">
			<xsl:if test="$multiplicity&gt;1">
				<xsl:for-each select="attribute[@name='Multiplicity']/graphics/graphic[@show=1]">
					<xsl:variable name="xoff">
						<xsl:if test="@xoff">
							<xsl:value-of select="@xoff"/>
						</xsl:if>
						<xsl:if test="not(@xoff)">
							<xsl:value-of select="0"/>
						</xsl:if>
					</xsl:variable>
					<xsl:variable name="yoff">
						<xsl:if test="@yoff">
							<xsl:value-of select="@yoff"/>
						</xsl:if>
						<xsl:if test="not(@yoff)">
							<xsl:value-of select="0"/>
						</xsl:if>
					</xsl:variable>
					<text class="{$class}" x="{@x}" y="{@y}" style="font-family:verdana; font-size:11px;" snp:net="{@net}">
						<xsl:value-of select="$multiplicity"/>
					</text>
				</xsl:for-each>
			</xsl:if>
			<xsl:for-each select="graphics/graphic[@show=1]">
				<xsl:variable name="list_of_points">
					<xsl:for-each select="points/point">
						<xsl:value-of select="@x"/>
						<xsl:text>,</xsl:text>
						<xsl:value-of select="@y"/>
						<xsl:if test="position() != last()">
							<xsl:text> </xsl:text>
						</xsl:if>
					</xsl:for-each>
				</xsl:variable>
				<xsl:if test="@pen and not(@net &gt; ../../@net)">
					<defs>
						<marker id="equalark_{@id}" viewBox="0 0 20 18" refX="19" refY="5" markerUnits="strokeWidth" markerWidth="15" markerHeight="12" orient="auto" fill="rgb({@brush})" stroke="rgb({@pen})" stroke-width=".4">
							<circle r="4" cx="5" cy="5" />
							<line x1="9" y1="5" x2="11" y2="5" />
							<circle r="4" cx="15" cy="5" />
						</marker>
					</defs>
					<polyline class="Edge" id="Edge_{@id}" fill="none" stroke="rgb({@pen})" stroke-width="1.5px" points="{$list_of_points}" marker-end="url(#equalark_{@id})" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}"/>
				</xsl:if>
				<xsl:if test="not(@pen) and not(@net &gt; ../../@net)">
					<polyline class="Edge" id="Edge_{@id}" fill="none" stroke="black" stroke-width="1.5px" points="{$list_of_points}" marker-end="url(#equalark000)" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}"/>
				</xsl:if>
				<xsl:if test="not(@pen) and (@net &gt; ../../@net)">
					<polyline class="Edge" id="Edge_{@id}" fill="none" stroke="blue" stroke-width="1.5px" points="{$list_of_points}" marker-end="url(#equalark00255)" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}"/>
				</xsl:if>
			</xsl:for-each>
		</g>
	</xsl:template>
	
	<!-- NEU: Abraeumkante (Reset Edge)-->
	<xsl:template match="edgeclasses/edgeclass[@name='Reset Edge']/edge">
		<xsl:variable name="multiplicity" select="normalize-space(attribute[@name='Multiplicity'])"/>
		<xsl:variable name="class" select="../@name"/>
		
		<g id="{@id}" class="{$class}" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}" snp:multiplicity="{$multiplicity}">
			<xsl:if test="$multiplicity&gt;1">
				<xsl:for-each select="attribute[@name='Multiplicity']/graphics/graphic[@show=1]">
					<xsl:variable name="xoff">
						<xsl:if test="@xoff">
							<xsl:value-of select="@xoff"/>
						</xsl:if>
						<xsl:if test="not(@xoff)">
							<xsl:value-of select="0"/>
						</xsl:if>
					</xsl:variable>
					<xsl:variable name="yoff">
						<xsl:if test="@yoff">
							<xsl:value-of select="@yoff"/>
						</xsl:if>
						<xsl:if test="not(@yoff)">
							<xsl:value-of select="0"/>
						</xsl:if>
					</xsl:variable>
					<text class="{$class}" x="{@x}" y="{@y}" style="font-family:verdana; font-size:11px;" snp:net="{@net}">
						<xsl:value-of select="$multiplicity"/>
					</text>
				</xsl:for-each>
			</xsl:if>
			<xsl:for-each select="graphics/graphic[@show=1]">
				<xsl:variable name="list_of_points">
					<xsl:for-each select="points/point">
						<xsl:value-of select="@x"/>
						<xsl:text>,</xsl:text>
						<xsl:value-of select="@y"/>
						<xsl:if test="position() != last()">
							<xsl:text> </xsl:text>
						</xsl:if>
					</xsl:for-each>
				</xsl:variable>
				<xsl:if test="@pen and not(@net &gt; ../../@net)">
					<defs>
						<marker id="abraeumkante_{@id}" viewBox="0 0 17 17" refX="13" refY="5" markerUnits="strokeWidth" markerWidth="20" markerHeight="18" orient="auto" fill="rgb({@brush})" stroke="rgb({@pen})" stroke-width=".4">
							<!-- Achtung_ relative Pfadangaben -->
							<!-- FF2 ua kann keine relativen Pfade lesen
								<path d="M 1 3 l 5 2 l -5 2 z
									 m 4 2 m 3 0
									 l 0 -2 l 5 2 l -5 2 l 0 -2" />-->
							<path d="M 1 3 L 6 5 L 1 7 z M 8 5 L 8 3 L 13 5 L 8 7 z"/>
						</marker>
					</defs>
					<polyline class="Edge" id="Edge_{@id}" fill="none" stroke="rgb({@pen})" stroke-width="1.5px" points="{$list_of_points}" marker-end="url(#abraeumkante_{@id})" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}"/>
				</xsl:if>
				<xsl:if test="not(@pen) and not(@net &gt; ../../@net)">
					<polyline class="Edge" id="Edge_{@id}" fill="none" stroke="black" stroke-width="1.5px" points="{$list_of_points}" marker-end="url(#abraeumkante000)" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}"/>
				</xsl:if>
				<xsl:if test="not(@pen) and (@net &gt; ../../@net)">
					<polyline class="Edge" id="Edge_{@id}" fill="none" stroke="blue" stroke-width="1.5px" points="{$list_of_points}" marker-end="url(#abraeumkante00255)" snp:source="{@source}" snp:target="{@target}" snp:net="{@net}"/>
				</xsl:if>
			</xsl:for-each>
		</g>
	</xsl:template>
	
</xsl:stylesheet>
